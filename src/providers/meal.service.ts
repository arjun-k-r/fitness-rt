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
  IFoodSearchResult,
  Meal,
  MealPlan,
  MealServing,
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
  private _nutritionRequirements: Nutrition;
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
    this._nutritionRequirements = _fitSvc.getUserRequirements();
  }

  /**
   * Verifies if the meal does not exceed the limit amount of carbohydrates
   * @param {Nutrition} nutrition - The meal nutrition
   * @returns {WarningMessage} Returns warning if the meal has too much carbohydrate
   */
  private _checkMealCarbs(nutrition: Nutrition): WarningMessage {
    return nutrition.carbs.value > (this._nutritionRequirements.carbs.value / 4) ? new WarningMessage(
      'Too much carbohydrates',
      `The meal should contain no more than ${Math.round(this._nutritionRequirements.carbs.value / 4)}g of carbohydrates`
    ) : null;
  }

  /**
   * Verifies if the meal is too complex for digestion (has more than 8 foods)
   * @param {Array} foodItems - The foods of the meal
   * @returns {WarningMessage} Returns warning if the meal is too complex
   */
  private _checkMealComplexity(foodItems: Array<Food | Recipe>): WarningMessage {
    return foodItems.length > 8 ? new WarningMessage(
      'The meal is too complex!',
      'More than 8 foods in a single meal makes it complex and difficult to digest, as it requires many types of enzymes, gastric juices, and timings.'
    ) : null;
  }

  /**
   * Verifies if the meal does not exceed the limit amount of calories
   * @param {Nutrition} nutrition - The meal nutrition
   * @returns {WarningMessage} Returns warning if the meal supplies too much energy
   */
  private _checkMealEnergy(nutrition: Nutrition): WarningMessage {
    return nutrition.energy.value > (this._nutritionRequirements.energy.value / 4) ? new WarningMessage(
      'Too many calories',
      `The meal should contain no more than ${Math.round(this._nutritionRequirements.energy.value / 4)} kilocalories`
    ) : null;
  }

  /**
   * Verifies if the meal does not exceed the limit amount of fats
   * @param {Nutrition} nutrition - The meal nutrition
   * @returns {WarningMessage} Returns warning if the meal has too much fat
   */
  private _checkMealFats(nutrition: Nutrition): WarningMessage {
    return nutrition.fats.value > (this._nutritionRequirements.fats.value / 4) ? new WarningMessage(
      'Too much fat',
      `The meal should contain no more than ${Math.round(this._nutritionRequirements.fats.value / 4)}g of fat`
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
   * Verifies if the meal does not exceed the limit amount of protein
   * @param {Nutrition} nutrition - The meal nutrition
   * @returns {WarningMessage} Returns warning if the meal has too much protein
   */
  private _checkMealProtein(nutrition: Nutrition): WarningMessage {
    return nutrition.protein.value > (this._nutritionRequirements.protein.value / 4) ? new WarningMessage(
      'Too much protein',
      `The meal should contain no more than ${Math.round(this._nutritionRequirements.protein.value / 4)}g of protein`
    ) : null;
  }

  /**
   * Verifies if each meal serving preparation todo is checked and respected
   * @description A complete healthy digestion and nutrient absorption requires healthy eating habits. How you eat is as important as what you eat
   * @param serving - The meal serving todo's
   * @returns {WarningMessage} Returns a warning to make the user create healthy eating habits
   */
  private _checkMealServing(serving: MealServing): WarningMessage {
    let warning: WarningMessage;
    _.values(serving).forEach((todo: boolean) => {
      if (!todo) {
        warning = new WarningMessage(
          'The meal serving preparations were not checked',
          'A complete healthy digestion and nutrient absorption requires healthy eating habits. How you eat is as important as what you eat'
        );
      }
    });

    return warning;
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
   * Verifies if the meal does not exceed the limit amount of sugar
   * @param {Nutrition} nutrition - The meal nutrition
   * @returns {WarningMessage} Returns warning if the meal has too much sugar
   */
  private _checkMealSugars(nutrition: Nutrition): WarningMessage {
    return nutrition.sugars.value > (this._nutritionRequirements.sugars.value / 4) ? new WarningMessage(
      'Too much sugar',
      `The meal should contain no more than ${Math.round(this._nutritionRequirements.sugars.value / 4)}g of sugars`
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
  * @param {number} mealIdx The meal index to check
  * @param {Array} mealPlan The meal index to check
  * @returns {Promise} Returns confirmation if the meal is or not healthy
  */
  public checkMeal(mealIdx: number, meals: Array<Meal>): Promise<boolean> {
    let meal: Meal = meals[mealIdx], warnings: Array<WarningMessage> = [];
    return new Promise((resolve, reject) => {
      let mealCarbsWarning: WarningMessage = this._checkMealCarbs(meal.nutrition),
        mealComplexityWarning: WarningMessage = this._checkMealComplexity(meal.mealItems),
        mealEnergyWarning: WarningMessage = this._checkMealEnergy(meal.nutrition),
        mealFatsWarning: WarningMessage = this._checkMealFats(meal.nutrition),
        mealPralWarning: WarningMessage = this._checkMealPral(meal.pral),
        mealProteinWarning: WarningMessage = this._checkMealProtein(meal.nutrition),
        mealServingWarning: WarningMessage = this._checkMealServing(meal.serving),
        mealSizeWarning: WarningMessage = this._checkMealSize(meal.quantity),
        mealSugarsWarning: WarningMessage = this._checkMealSugars(meal.nutrition);

      if (!!mealCarbsWarning) {
        warnings.push(mealCarbsWarning);
      }

      if (!!mealComplexityWarning) {
        warnings.push(mealComplexityWarning);
      }

      if (!!mealFatsWarning) {
        warnings.push(mealFatsWarning);
      }

      if (!!mealPralWarning) {
        warnings.push(mealPralWarning);
      }

      if (!!mealProteinWarning) {
        warnings.push(mealProteinWarning);
      }

      if (!!mealServingWarning) {
        warnings.push(mealServingWarning);
      }

      if (!!mealSizeWarning) {
        warnings.push(mealSizeWarning);
      }

      if (!!mealSugarsWarning) {
        warnings.push(mealSugarsWarning);
      }

      if (!warnings.length) {
        resolve(true);
      } else {
        reject(warnings);
      }
    });
  }

  /**
   * Calculates the meal nutritional values based on the foods
   * @param {Array} items - The foods of the meal
   * @returns {Nutrition} Returns the meal nutrition
   */
  public getMealNutrition(items: Array<Food | Recipe>): Nutrition {
    return this._nutritionSvc.getTotalNutrition(items);
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
          currMealPlan.warnings = currMealPlan.warnings || [];
          observer.next(currMealPlan);
          observer.complete();
        }
      });
    });
  }

  /**
   * Calculates the total nutrition of a meal plan
   * @description Each user has specific daily nutrition requirements (DRI)
   * We must know how much (%) of the requirements a he has fulfilled
   * @param {Array} meals - The meals of the current meal plan
   * @returns {Nutrition} Returns the meal plan nutrition
   */
  public getMealPlanNutrition(meals: Array<Meal>): Nutrition {
    return this._nutritionSvc.getPercentageNutrition(meals, true);
  }

  /**
   * Gets the alkalinity of a meal, based on its nutritional values
   * @param {Nutrition} nutrition - The nutrition of the meal
   * @returns {number} Returns the pral of the meal
   */
  public getMealPral(nutrition: Nutrition): number {
    return this._nutritionSvc.getPRAL(nutrition);
  }

  /**
   * Gets the size of the meal
   * @param {Array} items - The foods of the meal
   * @returns {number} Returns the quantity in grams of the meal
   */
  public getMealSize(items: Array<Food | Recipe>): number {
    return this._nutritionSvc.calculateQuantity(items);
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
    let mealTime: number = 0,
      mealTimeWarning: boolean = false;

    mealPlan.meals.forEach((meal: Meal, mealIdx: number) => {
      meal.time = moment(mealPlan.breakfastTime, 'hours').add(mealTime, 'hours').format('HH:mm');
      mealTime += 4;

      // Remve the meals which are later than 2 hours before sleep
      if (moment(this._bedTime, 'hours').subtract(moment(meal.time, 'hours').hours(), 'hours').hours() < 2) {
        mealPlan.meals.splice(mealIdx, mealPlan.meals.length - mealIdx);
        if (mealTimeWarning === false) {
          mealTimeWarning = true;
          mealPlan.warnings.push(new WarningMessage(
            'You must leave 2 hours between bed time and last meal for complete digestion',
            'Some meals were too late'
          ));
          return;
        }
      }
    });
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
      meal.nutrition = this.getMealNutrition(meal.mealItems);
      if (!!meal.wasNourishing && !meal.hasOwnProperty('$key')) {
        meal.nourishingKey = this._nourishingMeals.push(meal).key;
      } else if (!meal.wasNourishing) {
        this._nourishingMeals.remove(meal.nourishingKey);
        meal.nourishingKey = '';
      } else {
        this._nourishingMeals.update(meal['$key'], {
          isCold: meal.isCold,
          isRaw: meal.isRaw,
          mealItems: meal.mealItems,
          nickname: meal.nickname,
          nourishingKey: meal.nourishingKey,
          nutrition: meal.nutrition,
          pral: meal.pral,
          quantity: meal.quantity,
          serving: meal.serving,
          warnings: meal.warnings,
          wasNourishing: meal.wasNourishing
        });
      }
      mealPlan.meals[mealIdx] = meal;
      mealPlan.dailyNutrition = this.getMealPlanNutrition(mealPlan.meals);
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
      meals: mealPlan.meals || [],
      warnings: mealPlan.warnings || []
    });
  }

  /**
   * Gets the nutritional values of each selected food
   * @param {Array} items The selected food
   * @returns {Observable} Returns a stream of food reports
   */
  public serializeMealItems(items: Array<IFoodSearchResult>): Promise<Array<Food | Recipe>> {
    return this._foodSvc.serializeItems(items);
  }
}