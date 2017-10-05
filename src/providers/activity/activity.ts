// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Activity, ActivityPlan, ExerciseGoals, ExerciseLog } from '../../models';

// Providers
import { FitnessProvider } from '../fitness/fitness';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class ActivityProvider {
  private _activities$: FirebaseListObservable<Activity[]>;
  private _userWeight: number;
  constructor(
    private _db: AngularFireDatabase,
    private _fitPvd: FitnessProvider
  ) {
    this._activities$ = this._db.list('/activities', {
      query: {
        orderByChild: 'name'
      }
    });
  }

  public calculateActivityEnergyConsumption(activity: Activity, authId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this._userWeight) {
        const subscription: Subscription = this._fitPvd.getUserWeight$(authId).subscribe((weight: number) => {
          weight = weight['$value'] === null ? 0 : weight['$value'];
          this._userWeight = weight;
          subscription.unsubscribe();
          resolve(Math.round((activity.met * 3.5 * weight / 200) * activity.duration))
        }, (err: firebase.FirebaseError) => reject(err.message));
      } else {
        resolve(Math.round((activity.met * 3.5 * this._userWeight / 200) * activity.duration))
      }
    });
  }

  public calculateActivityPlanDuration(activities: Activity[]): number {
    return activities.reduce((acc: number, currActivity: Activity) => acc += currActivity.duration, 0);
  }

  public calculateActivityPlanEnergyConsumption(activities: Activity[]): number {
    return activities.reduce((acc: number, currActivity: Activity) => acc += currActivity.energyConsumption, 0);
  }

  public checkGoalAchievements(goals: ExerciseGoals, activityPlan: ActivityPlan): boolean {
    let energyConsumptionAchieved: boolean = false;
    let exerciseDurationAchieved: boolean = false;
    if (goals.duration.isSelected && activityPlan.totalDuration >= goals.duration.value) {
      exerciseDurationAchieved = true;
    } else if (goals.energy.isSelected && activityPlan.totalEnergyConsumption >= goals.energy.value) {
      energyConsumptionAchieved = true;
    }

    return energyConsumptionAchieved || exerciseDurationAchieved;
  }

  public checkGoodExercise(activityPlan: ActivityPlan): boolean {
    return activityPlan.totalDuration > 120 && activityPlan.totalEnergyConsumption > 600 && activityPlan.combos.energy && activityPlan.combos.hiit && !activityPlan.combos.lowActivity && !activityPlan.combos.overtraining && !activityPlan.combos.sedentarism;
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
    return activities.reduce((lowIntensity: boolean, activity: Activity) => lowIntensity = lowIntensity && activity.met < 4, true);
  }

  public checkOvertraining(activities: Activity[]): boolean {
    return activities.reduce((acc: number, activity: Activity) => acc += activity.met >= 6 ? activity.duration : 0, 0) > 45 || activities.reduce((acc: number, activity: Activity) => acc += activity.met > 8 ? activity.duration : 0, 0) > 20;
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

  public getEnergyConsumption$(authId: string): FirebaseObjectObservable<number> {
    return this._db.object(`/activity-plan/${authId}/${CURRENT_DAY}/totalEnergyConsumption`);
  }

  public getExerciseGoals$(authId: string): FirebaseObjectObservable<ExerciseGoals> {
    return this._db.object(`/activity-plan/${authId}/goals`);
  }

  public getExerciseLog$(authId: string): FirebaseListObservable<ExerciseLog[]> {
    return this._db.list(`/exercise-log/${authId}/`, {
      query: {
        limitToLast: 7
      }
    });
  }

  public getPrevActivityPlan$(authId: string): FirebaseObjectObservable<ActivityPlan> {
    return this._db.object(`/activity-plan/${authId}/${CURRENT_DAY - 1}`);
  }

  public saveActivityPlan(authId: string, activityPlan: ActivityPlan, weekLog: ExerciseLog[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      Promise.all([
        this._db.object(`/activity-plan/${authId}/${CURRENT_DAY}/totalEnergyConsumption`).set(activityPlan.totalEnergyConsumption),
        this._db.object(`/lifepoints/${authId}/${CURRENT_DAY}/exercise`).set(activityPlan.lifePoints)
      ])
        .then(() => {
          const newExerciseLog: ExerciseLog = new ExerciseLog(moment().format('dddd'), activityPlan.totalDuration, activityPlan.totalEnergyConsumption);
          if (!!weekLog.length) {
            weekLog.reverse();
            if (newExerciseLog.date !== weekLog[0].date) {
              this._db.list(`/exercise-log/${authId}/`).push(newExerciseLog).catch((err: firebase.FirebaseError) => console.error(`Error saving exercise log: ${err.message}`));
            } else {
              this._db.list(`/exercise-log/${authId}/`).update(weekLog[0]['$key'], newExerciseLog).catch((err: firebase.FirebaseError) => console.error(`Error saving exercise log: ${err.message}`));
            }
          } else {
            this._db.list(`/exercise-log/${authId}/`).push(newExerciseLog).catch((err: firebase.FirebaseError) => console.error(`Error saving exercise log: ${err.message}`));
          }
          this._db.object(`/activity-plan/${authId}/${CURRENT_DAY}`).set(activityPlan).then(() => {
            resolve();
          }).catch((err: firebase.FirebaseError) => reject(err));
        })
        .catch((err: Error) => console.error(`Error storing energy consumption and life points: ${err.toString()}`));
    });
  }

  public saveExerciseGoals(authId: string, goals: ExerciseGoals): firebase.Promise<void> {
    return this._db.object(`/activity-plan/${authId}/goals`).set(goals);
  }
}
