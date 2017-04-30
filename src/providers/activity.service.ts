import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { User } from '@ionic/cloud-angular';

// Third-party
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as moment from 'moment';

// Models
import { Activity, ActivityPlan } from '../models';

// Providers
import { FitnessService } from './fitness.service';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class ActivityService {
  private _activities: FirebaseListObservable<Array<Activity>>;
  private _activityLimitSubject: Subject<number> = new Subject();
  private _currentActivityPlan: FirebaseObjectObservable<ActivityPlan>;
  private _lastActivityPlan: FirebaseObjectObservable<ActivityPlan>;
  private _userWeight: number;
  constructor(
    private _af: AngularFire,
    private _fitSvc: FitnessService,
    private _user: User
  ) {
    this._activities = _af.database.list('/activities', {
      query: {
        //limitToFirst: this._activityLimitSubject,
        orderByChild: 'name'
      }
    });

    this._currentActivityPlan = _af.database.object(`/activity-plans/${_user.id}/${CURRENT_DAY}`);
    this._lastActivityPlan = _af.database.object(`/activity-plans/${_user.id}/${CURRENT_DAY - 1}`);

    this._userWeight = _fitSvc.getProfile().weight;
  }

  /**
   * Looks for imbalance in performed activities
   * @description We must exercise every day, both intellectually and physically, but not too much
   * @param {ActivityPlan} activityPlan - The activity plan to check
   * @returns {void}
   */
  private _checkActivityPlan(activityPlan: ActivityPlan): void {
    if (activityPlan.intellectualEffort > 480) {
      activityPlan.intellectualOverwork++;
      activityPlan.intellectualInactivity = 0;
    } else if (activityPlan.intellectualEffort < 60) {
      activityPlan.intellectualInactivity++;
      activityPlan.intellectualOverwork = 0;
    }

    if (activityPlan.physicalEffort > 240) {
      activityPlan.physicalOverwork++;
      activityPlan.physicalInactivity = 0;
    } else if (activityPlan.physicalEffort < 60) {
      activityPlan.physicalInactivity++;
      activityPlan.physicalOverwork = 0;
    }
  }

  /**
   * Changes the database query limit of activities
   * @param {number} limit - The maximum limit
   * @returns {void}
   */
  public changeActivityQueryLimit(limit: number): void {
    this._activityLimitSubject.next(limit);
  }

  /**
   * Queries the activities
   * @returns {FirebaseListObservable} Returns observable of activities
   */
  public getActivities$(): FirebaseListObservable<Array<Activity>> {
    return this._activities;
  }

  /**
   * Calculates the total duration of performed activities
   * @param {Array} activities - The activities to count
   * @returns {number} Returns the total duration
   */
  public getActivitiesDuration(activities: Array<Activity>): number {
    return activities.reduce((acc: number, currActivity: Activity) => acc += currActivity.duration, 0);
  }

  /**
   * Calculates the kilocalories burned during a performed energy
   * @description The formula was developed by Dr. Gily Ionesc
   * @param {Activity} activity - 
   */
  public getActivityEffort(activity: Activity): number {
    return Math.round((activity.met * 3.5 * this._userWeight / 200) * activity.duration);
  }

  /**
   * Queries the current day activity plan and checks for overwork or inactivity
   * @returns {Observable} Returns observable of the current day activity plan
   */
  public getActivityPlan$(): Observable<ActivityPlan> {
    return new Observable((observer: Observer<ActivityPlan>) => {
      this._currentActivityPlan.subscribe((currActivityPlan: ActivityPlan) => {
        if (currActivityPlan['$value'] === null) {
          let newActivityPlan = new ActivityPlan();

          // Get the previous day activity plan to check for activity imbalances
          this._lastActivityPlan.subscribe((lastActivityPlan: ActivityPlan) => {
            if (!lastActivityPlan.hasOwnProperty('$value')) {
              this._checkActivityPlan(lastActivityPlan);

              // Add up the intellectual activity imbalances of the previous activity plan along with the accumulated once from previous days or reset them if it is the case
              if (lastActivityPlan.intellectualInactivity > 0) {
                newActivityPlan.intellectualInactivity += lastActivityPlan.intellectualInactivity;
              } else if (lastActivityPlan.intellectualOverwork > 0) {
                newActivityPlan.intellectualOverwork += lastActivityPlan.intellectualOverwork;
              }

              // Add up the physical activity imbalances of the previous activity plan along with the accumulated once from previous days or reset them if it is the case
              if (lastActivityPlan.physicalInactivity > 0) {
                newActivityPlan.physicalInactivity += lastActivityPlan.physicalInactivity;
              } else if (lastActivityPlan.physicalOverwork > 0) {
                newActivityPlan.physicalOverwork += lastActivityPlan.physicalOverwork;
              }
            }

            observer.next(newActivityPlan);
            observer.complete();
          });
        } else {
          observer.next(currActivityPlan);
          observer.complete();
        }
      });
    });
  }

  /**
   * Calculates the total energy burn of performed activities
   * @param {Array} activities - The activities to count
   * @returns {number} Returns the total energy burn
   */
  public getTotalEnergyBurn(activities: Array<Activity>): number {
    return activities.reduce((acc: number, currActivity: Activity) => acc += currActivity.energyBurn, 0);
  }

  /**
   * Saves the updated activity in the current activity plan
   * @param {Activity} activity - The updated activity
   * @param {number} activityIdx - The index of the activity in the current activity plan
   * @param {ActivityPlan} activityPlan - The activity plan to save
   * @returns {void}
   */
  public saveActivity(activity: Activity, activityIdx: number, activityPlan: ActivityPlan): void {
    if (activity.type === 'Physical') {
      activityPlan.physicalActivities[activityIdx] = activity;
    } else if (activity.type === 'Intellectual') {
      activityPlan.intellectualActivities[activityIdx] = activity;
    }

    activityPlan.intellectualEffort = this.getActivitiesDuration(activityPlan.intellectualActivities);
    activityPlan.physicalEffort = this.getActivitiesDuration(activityPlan.physicalActivities);
    activityPlan.totalEnergyBurn = this.getTotalEnergyBurn([...activityPlan.intellectualActivities, ...activityPlan.physicalActivities]);
    console.log('Saving activity plan: ', activityPlan);

    this._currentActivityPlan.update({
      date: activityPlan.date,
      intellectualActivities: activityPlan.intellectualActivities,
      intellectualEffort: activityPlan.intellectualEffort,
      intellectualInactivity: activityPlan.intellectualInactivity,
      intellectualOverwork: activityPlan.intellectualOverwork,
      physicalActivities: activityPlan.physicalActivities,
      physicalEffort: activityPlan.physicalEffort,
      physicalInactivity: activityPlan.physicalInactivity,
      physicalOverwork: activityPlan.physicalOverwork,
      totalEnergyBurn: activityPlan.totalEnergyBurn
    });
  }

}
