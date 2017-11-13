// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { ActivityCategory, ActivityType, ActivityPlan, ExerciseLog, Fitness, Nutrition } from '../../models';

// Providers
import { FitnessProvider } from '../fitness/fitness';
import { NutritionProvider } from '../nutrition/nutrition';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class ActivityProvider {
  private _activities$: FirebaseListObservable<ActivityCategory[]>;
  private _userWeight: number;
  constructor(
    private _db: AngularFireDatabase,
    private _fitPvd: FitnessProvider,
    private _nutritionPvd: NutritionProvider
  ) {
    this._activities$ = this._db.list('/activity-categories', {
      query: {
        orderByChild: 'name'
      }
    });
  }

  public calculateActivityEnergyConsumption(activity: ActivityType, authId: string): Promise<number> {
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

  public calculateActivityPlanDuration(activities: ActivityType[]): number {
    return activities.reduce((acc: number, currActivity: ActivityType) => acc += currActivity.duration, 0);
  }

  public calculateActivityPlanEnergyConsumption(activities: ActivityType[]): number {
    return activities.reduce((acc: number, currActivity: ActivityType) => acc += currActivity.energyConsumption, 0);
  }

  public getActivityCategories$(): FirebaseListObservable<ActivityCategory[]> {
    return this._activities$;
  }

  public getActivityPlan$(authId: string): FirebaseObjectObservable<ActivityPlan> {
    return this._db.object(`/activity-plan/${authId}/${CURRENT_DAY}`);
  }

  public getEnergyConsumption$(authId: string): FirebaseObjectObservable<number> {
    return this._db.object(`/activity-plan/${authId}/${CURRENT_DAY}/totalEnergyConsumption`);
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
      const fitnessSubscription: Subscription = this._db.object(`/fitness/${authId}`).subscribe((fitness: Fitness) => {
        const newExerciseLog: ExerciseLog = new ExerciseLog(moment().format('dddd'), activityPlan.totalDuration, activityPlan.totalEnergyConsumption);
        const weekLength: number = weekLog.length;
        if (!!weekLength) {
          if (newExerciseLog.date !== weekLog[weekLength - 1].date) {
            weekLog.push(newExerciseLog);
          } else {
            weekLog[weekLength - 1] = Object.assign({}, newExerciseLog);
          }
        } else {
          weekLog.push(newExerciseLog);
        }
        Promise.all([
          this._db.object(`/exercise-log/${authId}/`).set(weekLog),
          this._db.object(`/activity-plan/${authId}/${CURRENT_DAY}`).set(activityPlan)
        ]).then(() => {
          if (fitness['$value'] !== null) {
            fitnessSubscription.unsubscribe();
            this._nutritionPvd.calculateRequirements(authId, fitness.age, fitness.bmr, fitness.gender, fitness.lactating, fitness.macronutrientRatios, fitness.pregnant, fitness.weight)
              .then((dailyRequirements: Nutrition) => {
                resolve();
              })
              .catch((err: firebase.FirebaseError) => reject(err));
          }
        }).catch((err: firebase.FirebaseError) => reject(err));
      }, (err: firebase.FirebaseError) => reject(err));
    });
  }
}
