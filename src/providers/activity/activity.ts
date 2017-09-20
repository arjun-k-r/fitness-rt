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
          }).catch((err: Error) => console.error(`Error getting user nutrition requirements: ${err.toString()}`));
      }).catch((err: Error) => console.error(`Error loading storage: ${err.toString()}`));
    });
  }

  public calculateActivityPlanDuration(activities: Activity[]): number {
    return activities.reduce((acc: number, currActivity: Activity) => acc += currActivity.duration, 0);
  }

  public calculateActivityPlanEnergyConsumption(activities: Activity[]): number {
    return activities.reduce((acc: number, currActivity: Activity) => acc += currActivity.energyConsumption, 0);
  }

  public checkHiit(activities: Activity[]): boolean {
    return activities.map((activity: Activity) => activity.met > 8)[0];
  }

  public checkLifePoints(activityPlan: ActivityPlan): number {
    let lifePoints: number = 0;
    if (activityPlan.totalDuration > 120 && activityPlan.totalEnergyConsumption > 600) {
      lifePoints += 10;
    } else {
      lifePoints -= 10;
    }

    if (activityPlan.combos.energy) {
      lifePoints += 10;
    } else {
      lifePoints -= 10;
    }

    if (activityPlan.combos.hiit) {
      lifePoints += 10;
    } else {
      lifePoints -= 10;
    }

    if (!activityPlan.combos.lowActivity) {
      lifePoints += 10;
    } else {
      lifePoints -= 10;
    }

    if (!activityPlan.combos.overtraining) {
      lifePoints += 10;
    } else {
      lifePoints -= 10;
    }

    if (!activityPlan.combos.sedentarism) {
      lifePoints += 15;
    } else {
      lifePoints -= 15;
    }

    return lifePoints;
  }

  public checkLowActivity(activities: Activity[]): boolean {
    return activities.map((activity: Activity) => activity.met < 4).length === activities.length;
  }

  public checkOvertraining(activities: Activity[]): boolean {
    return activities.reduce((acc: number, activity: Activity) => acc += activity.met >= 6 ? activity.duration : 0, 0) > 60;
  }

  public checkSedentarism(activityPlan: ActivityPlan): boolean {
    return activityPlan.totalDuration < 120;
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
        .catch((err: Error) => console.error(`Error storing energy consumption: ${err.toString()}`));
        this._storage.set(`exerciseLifePoints-${CURRENT_DAY}`, activityPlan.lifePoints)
        .catch((err: Error) => console.error(`Error storing exercise lifepoints: ${err.toString()}`));
    }).catch((err: Error) => console.error(`Error loading storage: ${err.toString()}`));
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
