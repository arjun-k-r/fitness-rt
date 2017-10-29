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
import { ActivityCategory, ActivityType, ActivityPlan, ExerciseGoals, ExerciseLog, Fitness, Nutrition } from '../../models';

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

  public checkDistanceAchievement(goals: ExerciseGoals, activityPlan: ActivityPlan): boolean {
    if (goals.distance.isSelected) {
      if (activityPlan.distanceWalked >= +goals.distance.value) {
        return true;
      }
    } else {
      return true;
    }

    return false;
  }

  public checkDurationAchievement(goals: ExerciseGoals, activityPlan: ActivityPlan): boolean {
    if (goals.duration.isSelected) {
      if (activityPlan.totalDuration >= +goals.duration.value) {
        return true;
      }
    } else {
      return true;
    }

    return false;
  }

  public checkEnergyAchievement(goals: ExerciseGoals, activityPlan: ActivityPlan): boolean {
    if (goals.energy.isSelected) {
      if (activityPlan.totalEnergyConsumption >= +goals.energy.value) {
        return true;
      }
    } else {
      return true;
    }

    return false;
  }

  public checkStepsAchievement(goals: ExerciseGoals, activityPlan: ActivityPlan): boolean {
    if (goals.steps.isSelected) {
      if (activityPlan.stepsWalked >= +goals.steps.value) {
        return true;
      }
    } else {
      return true;
    }

    return false;
  }

  public checkGoalAchievements(goals: ExerciseGoals, activityPlan: ActivityPlan): boolean {
    return this.checkDistanceAchievement(goals, activityPlan) && this.checkDurationAchievement(goals, activityPlan) && this.checkEnergyAchievement(goals, activityPlan) && this.checkStepsAchievement(goals, activityPlan) && (goals.distance.isSelected || goals.duration.isSelected || goals.energy.isSelected || goals.steps.isSelected);
  }

  public checkGoodExercise(activityPlan: ActivityPlan): boolean {
    return activityPlan.totalDuration > 120 && activityPlan.totalEnergyConsumption > 600 && activityPlan.combos.energy && !activityPlan.combos.lowActivity && !activityPlan.combos.overtraining && !activityPlan.combos.sedentarism;
  }

  public checkHiit(activities: ActivityType[]): boolean {
    return activities.map((activity: ActivityType) => activity.met > 8)[0];
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

  public checkLowActivity(activities: ActivityType[]): boolean {
    return activities.reduce((lowIntensity: boolean, activity: ActivityType) => lowIntensity = lowIntensity && activity.met < 4, true);
  }

  public checkOvertraining(activities: ActivityType[]): boolean {
    return activities.reduce((acc: number, activity: ActivityType) => acc += activity.met >= 6 ? activity.duration : 0, 0) > 45 || activities.reduce((acc: number, activity: ActivityType) => acc += activity.met > 8 ? activity.duration : 0, 0) > 20;
  }

  public checkSedentarism(activityPlan: ActivityPlan): boolean {
    return activityPlan.totalDuration < 120;
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

  public getTimeout(authId: string): FirebaseObjectObservable<number> {
    return this._db.object(`/activity-plan/${authId}/timeout`)
  }

  public saveActivityPlan(authId: string, activityPlan: ActivityPlan, weekLog: ExerciseLog[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      const fitnessSubscription: Subscription = this._db.object(`/fitness/${authId}`).subscribe((fitness: Fitness) => {
        const newExerciseLog: ExerciseLog = new ExerciseLog(moment().format('dddd'), activityPlan.distanceWalked, activityPlan.totalDuration, activityPlan.totalEnergyConsumption, activityPlan.stepsWalked);
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
          this._db.object(`/lifepoints/${authId}/${CURRENT_DAY}/exercise`).set(activityPlan.lifePoints),
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

  public saveExerciseGoals(authId: string, goals: ExerciseGoals): Promise<void> {
    return this._db.object(`/activity-plan/${authId}/goals`).set(goals);
  }

  public saveTimeout(authId: string, timeout: number): Promise<void> {
    return this._db.object(`/activity-plan/${authId}/timeout`).set(timeout);
  }
}
