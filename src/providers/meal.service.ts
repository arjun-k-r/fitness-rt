// App
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { User } from '@ionic/cloud-angular';
import 'rxjs/operator/map';

// Third-party
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as moment from 'moment';
import * as _ from 'lodash';

// Models
import {
  Food,
  Meal,
  MealPlan,
  NutrientDeficiencies,
  NutrientExcesses,
  Nutrition,
  Recipe,
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
    private _af: AngularFire,
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
    this._currentMealPlan = _af.database.object(`/meal-plans/${_user.id}/${CURRENT_DAY}`);
    this._lastMealPlan = _af.database.object(`/meal-plans/${_user.id}/${CURRENT_DAY - 1}`);

    this._nourishingMeals = _af.database.list(`/nourishing-meals/${_user.id}`);
  }

  /**
   * Verifies if the meal is too complex for digestion (has more than 8 foods)
   * @param {Array} foodItems - The foods of the meal
   * @returns {WarningMessage} Returns warning if the meal is too complex
   */
  private _checkMealComplexity(foodItems: Array<Food | Recipe>): WarningMessage {
    return foodItems.length > 6 ? new WarningMessage(
      'The meal is too complex!',
      'More than 8 foods in a single meal makes it complex and difficult to digest, as it requires many types of enzymes, gastric juices, and timings.'
    ) : null;
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
   * Verifies if each meal is served correclty
   * @description A complete healthy digestion and nutrient absorption requires healthy eating habits. How you eat is as important as what you eat
   * @param {Meal} meal - The meal to check
   * @returns {WarningMessage} Returns a warning to make the user create healthy eating habits
   */
  private _checkMealServing(meal: Meal): Array<WarningMessage> {
    let warnings: Array<WarningMessage> = [];
    if (!meal.chewing) {
      warnings.push(new WarningMessage(
        'Chewing is the first step of the digestion process',
        'A complete digestion requires finely chewed and insalivated food. Have you witnessed any discomfort after your meal?'
      ));
    }

    if (!meal.gratitude) {
      warnings.push(new WarningMessage(
        'Some people do not have what to eat, you know?',
        'Be grateful for every meal you have and enjoy each bite like it is your last one, because it may be...'
      ));
    }

    if (!meal.hunger) {
      warnings.push(new WarningMessage(
        'Are you watching your cravings?',
        'Eating between meals or when not hungry interferes with previous digestion processes and may lead yo weight gain and digestive problems'
      ));
    }

    if (meal.isCold) {
      warnings.push(new WarningMessage(
        'Avoid cold foods',
        'Digestion is a mechanical and chimical process and requires heat. It is just like a cooking process.'
      ));
    }

    if (!meal.isNatural) {
      warnings.push(new WarningMessage(
        'We need real food',
        'We are genetically designes to digest and natural (real) food. Comercial foods are just empty calories without any nutritional values (poison)'
      ));
    }

    if (!meal.isRaw) {
      warnings.push(new WarningMessage(
        'Cooking removes the oxygen (life) from foods',
        'The more oxygen a food has, the more alkaline forming (nourishing) it is. Try to eat at least half of your meals raw.'
      ));
    }

    if (!meal.relaxation) {
      warnings.push(new WarningMessage(
        'Calm down',
        'Eating when stressed, angry, sad or while working, walking, or during any other activities interferes with digestion and may lead to indigestion and other digestive problems. Sit down, take a deep breath, relax, and savour your food with complete focus and joy.'
      ));
    }

    return warnings;
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
   * Get 4-hour interval meals, starting from breakfast time, as long as the last meal is 2 hours before bed
   * @param {string} breakfastTime - The time of the first meal used as reference
   * @returns {Array} Returns an array of meals
   */
  private _getMeals(breakfastTime: string): Array<Meal> {
    let meals: Array<Meal> = [],
      newMeal: Meal,
      newMealTime: number = 0;

    do {
      newMeal = new Meal();
      newMeal.time = moment(breakfastTime, 'hours').add(newMealTime, 'hours').format('HH:mm');
      meals.push(newMeal);
      newMealTime += 4;
    } while (moment(this._bedTime, 'hours').subtract(moment(newMeal.time, 'hours').hours(), 'hours').hours() >= 6);

    return meals;
  }

  /**
  * Verifies if a meal is proper
  * @param {Meal} meal The meal to check
  * @returns {void}
  */
  public checkMeal(meal: Meal): void {
    meal.warnings = _.compact([
      this._nutritionSvc.checkAlcohol(meal.nutrition),
      this._nutritionSvc.checkCaffeine(meal.nutrition),
      this._nutritionSvc.checkCarbs(meal.nutrition),
      this._checkMealComplexity(meal.mealItems),
      this._nutritionSvc.checkEnergy(meal.nutrition),
      this._nutritionSvc.checkFats(meal.nutrition),
      this._checkMealPral(meal.pral),
      this._nutritionSvc.checkProtein(meal.nutrition),
      ...this._checkMealServing(meal),
      this._checkMealSize(meal.quantity),
      this._nutritionSvc.checkSodium(meal.nutrition),
      this._nutritionSvc.checkSugars(meal.nutrition),
      this._nutritionSvc.checkTransFat(meal.nutrition)
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
          newMealPlan.meals = this._getMeals(this._wakeUpTime);

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
          currMealPlan.meals = currMealPlan.meals || this._getMeals(this._wakeUpTime);
          observer.next(currMealPlan);
          observer.complete();
        }
      });
    });
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
      mealPlan.meals = [...mealPlan.meals, ...this._getMeals(moment(lastMealTime, 'hours').add(4, 'hours').format('HH:mm'))];
    }
  }

  /**
   * Saves the updated meal in the current meal plan
   * @param {Meal} meal - The updated meal
   * @param {number} mealIdx - The index of the meal in the current meal plan
   * @param {MealPlan} mealPlan - The meal plan to save
   * @returns {void}
   */
  public saveMeal(meal: Meal, mealIdx: number, mealPlan: MealPlan): void {
    if (!!meal) {
      meal.nutrition = this._nutritionSvc.getTotalNutrition(meal.mealItems);
      if (!!meal.wasNourishing && meal.nourishingKey === '') {
        meal.nourishingKey = this._nourishingMeals.push(meal).key;
      } else if (!meal.wasNourishing && meal.nourishingKey !== '') {
        this._nourishingMeals.remove(meal.nourishingKey);
        meal.nourishingKey = '';
      } else if (!!meal.wasNourishing && meal.nourishingKey !== '') {
        this._nourishingMeals.update(meal['$key'], {
          chewing: meal.chewing,
          gratitude: meal.gratitude,
          hunger: meal.hunger,
          isCold: meal.isCold,
          isNatural: meal.isNatural,
          isRaw: meal.isRaw,
          mealItems: meal.mealItems || [],
          nickname: meal.nickname,
          nourishingKey: meal.nourishingKey,
          nutrition: meal.nutrition,
          pral: meal.pral,
          quantity: meal.quantity,
          relaxation: meal.relaxation,
          warnings: meal.warnings || [],
          wasNourishing: meal.wasNourishing
        });
      }
      mealPlan.meals[mealIdx] = meal;
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