// Angular
import { Injectable } from '@angular/core';

// Ionic
import { Storage } from '@ionic/storage';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Activity, ActivityPlan } from '../../models';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class ActivityProvider {
  private _activities$: FirebaseListObservable<Activity[]>;
  constructor(
    private _db: AngularFireDatabase,
    private _storage: Storage
  ) {
    this._activities$ = this._db.list('/activities', {
      query: {
        orderByChild: 'name'
      }
    });
  }

  public calculateActivityEnergyConsumption(activity: Activity): Promise<number> {
    return new Promise((resolve, reject) => {
      this._storage.ready().then((storage: LocalForage) => {
        this._storage.get('weight')
          .then((weight: number) => {
            resolve(Math.round((activity.met * 3.5 * weight / 200) * activity.duration))
          }).catch((err: Error) => console.error(`Error getting user nutrition requirements: ${err}`));
      }).catch((err: Error) => console.error(`Error loading storage: ${err}`));
    });
  }

  public calculateActivityPlanDuration(activities: Activity[]): number {
    return activities.reduce((acc: number, currActivity: Activity) => acc += currActivity.duration, 0);
  }

  public calculateActivityPlanEnergyConsumption(activities: Activity[]): number {
    return activities.reduce((acc: number, currActivity: Activity) => acc += currActivity.energyConsumption, 0);
  }

  public getActivities$(): FirebaseListObservable<Activity[]> {
    return this._activities$;
  }

  public getActivityPlan$(authId: string): FirebaseObjectObservable<ActivityPlan> {
    return this._db.object(`/activity-plan/${authId}/${CURRENT_DAY}`);
  }

  public saveActivityPlan(authId: string, activityPlan: ActivityPlan): firebase.Promise<void> {
    this._storage.ready().then(() => {
      this._storage.set(`energyConsumption-${CURRENT_DAY}`, activityPlan.totalEnergyConsumption)
        .catch((err: Error) => console.error(`Error storing energy consumption: ${err}`));
    }).catch((err: Error) => console.error(`Error loading storage: ${err}`));
    if (!!activityPlan.weekPlan && !!activityPlan.weekPlan.length) {
      if (activityPlan.date !== activityPlan.weekPlan[0].date) {
        activityPlan.weekPlan = [activityPlan, ...activityPlan.weekPlan.slice(0, 6)];
      } else {
        activityPlan.weekPlan[0] = Object.assign({}, activityPlan);
      }
    } else {
      activityPlan.weekPlan = [activityPlan];
    }
    return this._db.object(`/activity-plan/${authId}/${CURRENT_DAY}`).set(activityPlan);
  }
}
