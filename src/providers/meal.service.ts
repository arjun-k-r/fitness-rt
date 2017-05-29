// App
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { User } from '@ionic/cloud-angular';
import 'rxjs/operator/map';

// Third-party
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as moment from 'moment';
import * as _ from 'lodash';

// Models
import {
  Meal,
  MealPlan,
  NutrientDeficiencies,
  NutrientExcesses,
  Nutrition,
  SleepPlan,
  WarningMessage
} from '../models';

// Providers
import { FitnessService } from './fitness.service'
import { FoodService } from './food.service';
import { NutritionService } from './nutrition.service';
import { SleepService } from './sleep.service';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class MealService {
  private _bedTime: string;
  private _currentMealPlan: FirebaseObjectObservable<MealPlan>;
  private _lastMealPlan: FirebaseObjectObservable<MealPlan>;
  private _nourishingMeals: FirebaseListObservable<Array<Meal>>;
  private _wakeUpTime: string;
  constructor(
    private _db: AngularFireDatabase,
    private _fitSvc: FitnessService,
    private _foodSvc: FoodService,
    private _nutritionSvc: NutritionService,
    private _sleepSvc: SleepService,
    private _user: User
  ) {
    _sleepSvc.getSleepPlan$().subscribe((sleePlan: SleepPlan) => {
      this._bedTime = moment(_sleepSvc.getCurrentSleep(sleePlan).bedTime, 'hours').format('HH:mm');
      this._wakeUpTime = moment(_sleepSvc.getCurrentSleep(sleePlan).wakeUpTime, 'hours').format('HH:mm')
    });
    this._currentMealPlan = _db.object(`/meal-plans/${_user.id}/${CURRENT_DAY}`);
    this._lastMealPlan = _db.object(`/meal-plans/${_user.id}/${CURRENT_DAY - 1}`);

    this._nourishingMeals = _db.list(`/nourishing-meals/${_user.id}`);
  }

  /**
   * Verifies if the meal is alkaline forming
   * @description Acid forming meals are inflammatory and the root of all diseases. The PRAL value must remain, at least, below 1.
   * @param {number} size - The size of the meal
   * @returns {WarningMessage} Returns warning if the meal is acid forming
   */
  private _checkMealPral(pral: number): WarningMessage {
    return pral >= 1 ? new WarningMessage(
      'The meal is acid forming',
      'Acid forming food and meals cause inflammation, which is the root of all diseases. Try adding some alkaline forming foods, like green vegetables, with PRAL below 0'
    ) : null;
  }

  /**
   * Verifies if the meal is too big for normal digestion
   * @param {number} size - The size of the meal
   * @returns {WarningMessage} Returns warning if the meal is too big
   */
  private _checkMealSize(size: number): WarningMessage {
    return size > 900 ? new WarningMessage(
      'The meal is too large!',
      "The meal most not exceed the stomach's capacity of 900g"
    ) : null;
  }

  /**
  * Verifies if a meal is proper
  * @param {Meal} meal The meal to check
  * @returns {void}
  */
  public checkMeal(meal: Meal): void {
    meal.warnings = _.compact([
      ...this._nutritionSvc.checkNutrition(meal.nutrition),
      this._checkMealPral(meal.pral),
      this._checkMealSize(meal.quantity)
    ]);
  }

  /**
   * Queries the current day meal plan and checks for nutrient deficiency or excess
   * @returns {Observable} Returns observable of the current day meal plan
   */
  public getMealPlan$(): Observable<MealPlan> {
    return new Observable((observer: Observer<MealPlan>) => {
      this._currentMealPlan.subscribe((currMealPlan: MealPlan) => {
        if (currMealPlan['$value'] === null) {
          let newMealPlan: MealPlan = new MealPlan();
          newMealPlan.meals = this.getMeals(this._wakeUpTime);

          //Get the previous day meal plan to check for deficiencies and excesses
          this._lastMealPlan.subscribe((lastMealPlan: MealPlan) => {
            if (!lastMealPlan.hasOwnProperty('$value')) {
              let prevDeficiencies: NutrientDeficiencies = this._nutritionSvc.getNutritionDeficiencies(lastMealPlan.dailyNutrition),
                prevExcesses: NutrientExcesses = this._nutritionSvc.getNutritionExcesses(lastMealPlan.dailyNutrition);

              // Add the deficiencies of the last meal plan, along with those from previous meal plans or reset them if the previous meal plan fulfilled the requirements the previous day
              for (let nutrientKey in prevDeficiencies) {
                newMealPlan.deficiency[nutrientKey] = prevDeficiencies[nutrientKey] === 1 ? prevDeficiencies[nutrientKey] + lastMealPlan.deficiency[nutrientKey] : 0;
              }

              // Add the excesses of the last meal plan, along with those from previous meal plans or reset them if the previous meal plan did no longer exceed the requirements the previous day
              //We need to count the days of excesses
              for (let nutrientKey in prevExcesses) {
                newMealPlan.excess[nutrientKey] = prevExcesses[nutrientKey] === 1 ? prevExcesses[nutrientKey] + lastMealPlan.excess[nutrientKey] : 0;
              }
            }

            observer.next(newMealPlan);
            observer.complete();
          });
        } else {
          currMealPlan.meals = currMealPlan.meals || this.getMeals(this._wakeUpTime);
          observer.next(currMealPlan);
          observer.complete();
        }
      });
    });
  }

  /**
  * Get 4-hour interval meals, starting from breakfast time, as long as the last meal is 2 hours before bed
  * @param {string} breakfastTime - The time of the first meal used as reference
  * @returns {Array} Returns an array of meals
  */
  public getMeals(breakfastTime: string): Array<Meal> {
    let meals: Array<Meal> = [],
      newMeal: Meal,
      newMealTime: number = 0;

      breakfastTime = breakfastTime || this._wakeUpTime || moment().format('HH:mm');

    do {
      newMeal = new Meal();
      newMeal.time = moment(breakfastTime, 'hours').add(newMealTime, 'hours').format('HH:mm');
      meals.push(newMeal);
      newMealTime += 4;
    } while (moment(this._bedTime, 'hours').subtract(moment(newMeal.time, 'hours').hours(), 'hours').hours() >= 6);

    return meals;
  }

  /**
   * Gets the nourishing meals from the database
   * @returns {FirebaseListObservable} Returns an observable that publishes the meals
   */
  public getNourishingMeals$(): FirebaseListObservable<Array<Meal>> {
    return this._nourishingMeals;
  }

  /**
   * Reorganize the meals based on the breakfast time and bedtime, diffused at 4 hour interval
   * @param {MealPlan} mealPlan - The meal plan
   * @returns {void}
   */
  public reorganizeMeals(mealPlan: MealPlan): void {
    let mealTime: number = 0;

    mealPlan.meals.forEach((meal: Meal, mealIdx: number) => {
      meal.time = moment(mealPlan.breakfastTime, 'hours').add(mealTime, 'hours').format('HH:mm');
      mealTime += 4;

      // Remve the meals which are later than 2 hours before sleep
      if (moment(this._bedTime, 'hours').subtract(moment(meal.time, 'hours').hours(), 'hours').hours() < 2) {
        mealPlan.meals.splice(mealIdx, mealPlan.meals.length - mealIdx);
        return;
      }
    });

    // Add more meals if there is enough time until bedtime
    let lastMealTime: string = mealPlan.meals[mealPlan.meals.length - 1].time;
    if (moment(this._bedTime, 'hours').subtract(moment(lastMealTime, 'hours').hours(), 'hours').hours() >= 6) {
      mealPlan.meals = [...mealPlan.meals, ...this.getMeals(moment(lastMealTime, 'hours').add(4, 'hours').format('HH:mm'))];
    }
  }

  /**
   * Saves the updated meal in the current meal plan
   * @param {Meal} meal - The updated meal
   * @param {number} mealIdx - The index of the meal in the current meal plan
   * @param {MealPlan} mealPlan - The meal plan to save
   * @returns {void}
   */
  public saveMeal(meal: Meal, mealPlan: MealPlan): void {
    if (!!meal) {
      meal.nutrition = this._nutritionSvc.getTotalNutrition(meal.mealItems);
      if (!!meal.wasNourishing && meal.nourishingKey === '') {
        meal.nourishingKey = this._nourishingMeals.push(meal).key;
      } else if (!meal.wasNourishing && meal.nourishingKey !== '') {
        this._nourishingMeals.remove(meal.nourishingKey);
        meal.nourishingKey = '';
      } else if (!!meal.wasNourishing && meal.nourishingKey !== '') {
        this._nourishingMeals.update(meal['$key'], {
          mealItems: meal.mealItems || [],
          nickname: meal.nickname,
          nourishingKey: meal.nourishingKey,
          nutrition: meal.nutrition,
          pral: meal.pral,
          quantity: meal.quantity,
          warnings: meal.warnings || [],
          wasNourishing: meal.wasNourishing
        });
      }
      mealPlan.dailyNutrition = this._nutritionSvc.getPercentageNutrition(mealPlan.meals, true);
    } else {
      mealPlan.dailyNutrition = new Nutrition();
    }

    this.saveMealPlan(mealPlan);
  }

  public saveMealPlan(mealPlan: MealPlan): void {
    console.log('Saving meal plan: ', mealPlan);

    this._currentMealPlan.update({
      breakfastTime: mealPlan.breakfastTime,
      dailyNutrition: mealPlan.dailyNutrition,
      date: mealPlan.date,
      deficiency: mealPlan.deficiency,
      excess: mealPlan.excess,
      meals: mealPlan.meals || []
    });
  }
}