import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Storage } from '@ionic/storage';

// Third-party
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import * as _ from 'lodash';

// Models
import { Activity, ActivityPlan, WarningMessage } from '../../models';

// Providers
import { CURRENT_DAY, FitnessService } from '../fitness/fitness.service';
import { MealService } from '../meal/meal.service';
import { NutritionService } from '../nutrition/nutrition.service';

@Injectable()
export class ActivityService {
  private _activities$: FirebaseListObservable<Array<Activity>>;
  private _currentActivityPlan$: FirebaseObjectObservable<ActivityPlan>;
  private _userWeight: number;
  constructor(
    private _afAuth: AngularFireAuth,
    private _db: AngularFireDatabase,
    private _fitSvc: FitnessService,
    private _mealSvc: MealService,
    private _nutritionSvc: NutritionService,
    private _storage: Storage
  ) {
    this._activities$ = _db.list('/activities', {
      query: {
        orderByChild: 'name'
      }
    });
  }

  private _checkInactivity(activityPlan: ActivityPlan): void {
    if (activityPlan.totalDuration < 12) {
      activityPlan.warnings = [...activityPlan.warnings, new WarningMessage(
        'You have to be physically active 12 hours per day',
        'Try to move as lot as you can. Take the stairs instead of the elevator, walk instead of taking the bus, taxi, or car, stand up instead of sitting on the chair, avoid sitting for more then 50 minutes.'
      )];
    }
  }

  public calculateDurationTotal(activities: Array<Activity>): number {
    return activities.reduce((acc: number, currActivity: Activity) => acc += currActivity.duration, 0);
  }

  public calculateEnergyBurn(activity: Activity): number {
    return Math.round((activity.met * 3.5 * this._userWeight / 200) * activity.duration);
  }

  public calculateEnergyBurnTotal(activities: Array<Activity>): number {
    return activities.reduce((acc: number, currActivity: Activity) => acc += currActivity.energyBurn, 0);
  }

  public checkActivity(activity: Activity, activityPlan: ActivityPlan): void {
    if (activity.met >= 8 && activity.duration > 45) {
      activityPlan.warnings = [new WarningMessage(
        'Too much intense exercise at once',
        'Try to keep your intense exercise sessions to less than 45 minutes'
      )];
    } else {
      activityPlan.warnings = [];
    }
  }

  public checkActivityPlan(activityPlan: ActivityPlan): void {
    activityPlan.warnings = _.compact([
      this._checkInactivity(activityPlan)
    ]);
  }

  public getActivities$(): FirebaseListObservable<Array<Activity>> {
    return this._activities$;
  }

  public getActivityPlan$(): Observable<ActivityPlan> {
    return new Observable((observer: Observer<ActivityPlan>) => {
      this._afAuth.authState.subscribe((auth: firebase.User) => {
        if (!!auth) {
          this._currentActivityPlan$ = this._db.object(`/activity-plans/${auth.uid}/${CURRENT_DAY}`);
          this._currentActivityPlan$.subscribe((currActivityPlan: ActivityPlan) => {
            if (currActivityPlan['$value'] === null) {
              this._currentActivityPlan$.set(new ActivityPlan());
            } else {
              // Firebase removes empty objects on save
              currActivityPlan.activities = currActivityPlan.activities || [];
              currActivityPlan.warnings = currActivityPlan.warnings || [];
              observer.next(currActivityPlan);
            }
          }, (err: firebase.FirebaseError) => observer.error(err));
        }
      }), (err: firebase.FirebaseError) => observer.error(err);
    });
  }

  public getLeftEnergy(): Promise<number> {
    return new Promise((resolve, reject) => {
      this._storage.ready().then(() => {
        this._storage.get(`energyOutput${CURRENT_DAY}`).then((energyOutput: number = 0) => {
          this._storage.get(`energyInput${CURRENT_DAY}`).then((energyInput: number = 0) => {
            resolve(energyInput - energyOutput)
          }).catch((err: Error) => reject(err));
        }).catch((err: Error) => reject(err));
      }).catch((err: Error) => reject(err));
    });
  }

  public saveActivityPlan(activityPlan: ActivityPlan): Promise<number> {
    return new Promise((resolve, reject) => {
      this._storage.ready().then(() => {
        this._storage.set(`energyOutput${CURRENT_DAY}`, activityPlan.totalEnergyBurn).then(() => {
          this._storage.get(`energyInput${CURRENT_DAY}`).then((energyInput: number = 0) => {
            this._currentActivityPlan$.update({
              activities: activityPlan.activities,
              date: activityPlan.date,
              totalDuration: activityPlan.totalDuration,
              totalEnergyBurn: activityPlan.totalEnergyBurn,
              warnings: activityPlan.warnings
            }).then(() => resolve(energyInput - activityPlan.totalEnergyBurn));
          }).catch((err: Error) => reject(err));
        }).catch((err: Error) => reject(err));
      }).catch((err: Error) => reject(err));
    });
  }
}
