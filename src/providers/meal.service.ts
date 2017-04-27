// App
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { User } from '@ionic/cloud-angular';
import 'rxjs/operator/map';

// Third-party
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import * as moment from 'moment';
import * as _ from 'lodash';

// Models
import { Food, IFoodSearchResult, Meal, MealFoodItem, MealPlan, MealServing, WarningMessage, Nutrition, UserProfile } from '../models';

// Providers
import { FitnessService } from './fitness.service'
import { FoodCombiningService } from './food-combining.service';
import { FoodDataService } from './food-data.service';
import { FoodService } from './food.service';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class MealService {
  private _mealPlan: FirebaseObjectObservable<MealPlan>;
  constructor(
    private _af: AngularFire,
    private _combiningSvc: FoodCombiningService,
    private _fitSvc: FitnessService,
    private _foodSvc: FoodService,
    private _foodDataSvc: FoodDataService,
    private _user: User
  ) {
    this._mealPlan = _af.database.object(`/meal-plans/${_user.id}/${CURRENT_DAY}`);
  }

  /**
   * Verifies if the meal is too complex for digestion (has more than 6 food items)
   * @param {Array} foodItems - The food items of the meal
   * @returns {WarningMessage} Returns warning if the meal is too complex
   */
  private _checkMealComplexity(foodItems: Array<MealFoodItem>): WarningMessage {
    return foodItems.length > 6 ? new WarningMessage(
      'The meal is too complex!',
      'More than 6 food items in a signle meal makes it complex and difficult to digest, as it requires many types of enzymes, gastric juices, and timings.'
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
    return size > 750 ? new WarningMessage(
      'The meal is too large!',
      "The meal most be 80% of your stomach's capacity (900 g). The rest of the 20% is required for digestive juices."
    ) : null;
  }

  /**
   * Increments the meal tastes by one for each food item containing a specific taste
   * @description According to Ayurveda, a balanced meal contains all six tastes in order to completely nourish and satisfy the body.
   * @param {Meal} meal - The meal to check
   */
  private _checkMealTastes(meal: Meal): void {
    meal.mealItems.forEach((item: MealFoodItem) => item.tastes.forEach((taste: string) => meal.tastes[taste.toLocaleLowerCase()]++));
  }

  /**
   * @returns {Array} Returns the planned meals for the day by breakfast time and sleep time.
   */
  private _getMeals(): Array<Meal> {
    /*
    let profile: UserProfile = this._fitSvc.getProfile(),
      breakfastTime: number = +profile.mealPlan.breakfastTime.split(':')[0],
      meals: Array<Meal> = [],
      mealTime: number = 0,
      newMeal: Meal,
      bedTime: number = +profile.sleepPlan.bedTime.split(':')[0] + 12;

    // As long as the last meal is 2 hours before sleep
    while (mealTime < bedTime - 6) {
      newMeal = new Meal();
      newMeal.time = moment({ 'hours': breakfastTime, 'minutes': 0 })
        .add({ 'hours': mealTime, 'minutes': 0 })
        .format('hh:mm a');
      meals.push(newMeal);
      mealTime += +profile.mealPlan.interval
    }

    return meals;
    */
    return [];
  }

  /**
   * Organises the meal timing
   * @description Meals need to be timed by the previous meal digestion duration
   * 1. Fluids need at least 30 minutes to pass through the intestines
   * 2. Melons require 30 minutes of digestion ()
   * 3. Fruits require 30-60 minutes of digestion
   * 4. Starch requires 2 hours of digestion
   * 5. Protein requires 4 hours of digestion
   * @param {Array} meals The meals to reaorganise
   * @returns {Array} Returns the reaorganised meals
   */
  private _setupMeals(meals: Array<Meal>): Array<Meal> {
    /*
    let bedTime: number = +this._fitSvc.getProfile().sleepPlan.bedTime.split(':')[0] + 12,
      currMealHour: number,
      currMealMinutes: number,
      currMealTimeItems: Array<string>,
      lastMealType: string,
      lastMealHour: number,
      lastMealMinutes: number,
      lastMealTimeItems: Array<string>,
      mealInterval: number = +this._fitSvc.getProfile().mealPlan.interval,
      mealHour: number,
      mealMinutes: number,
      newMeal: Meal;

    for (let i = 0; i < meals.length - 2; i++) {
      currMealTimeItems = meals[i].time.split(':');
      currMealHour = +currMealTimeItems[0];
      currMealMinutes = +currMealTimeItems[1].split(' ')[0];

      if (meals[i].type === 'Beverages meal' || meals[i].type === 'Melons meal') {
        mealHour = 0;
        mealMinutes = 30;
      } else if (meals[i].type === 'Fruit meal') {
        mealHour = 1;
        mealMinutes = 0;
      } else if (meals[i].type === 'Starch meal') {
        mealHour = 2;
        mealMinutes = 0;
      } else if (meals[i].type === 'Protein meal') {
        mealHour = 4;
        mealMinutes = 0;
      } else {
        mealHour = mealInterval;
        mealMinutes = 0;
      }

      meals[i + 1].time = moment({ 'hours': currMealHour, 'minutes': currMealMinutes })
        .add({ 'hours': mealHour, 'minutes': mealMinutes })
        .format('hh:mm a');
    }

    lastMealTimeItems = meals[meals.length - 1].time.split(':');
    lastMealType = meals[meals.length - 1].type;
    lastMealHour = +lastMealTimeItems[0];
    lastMealMinutes = +lastMealTimeItems[1].split(' ')[0];

    if (lastMealType === 'Beverages meal' || lastMealType === 'Melons meal') {
      mealHour = 0;
      mealMinutes = 30;
    } else if (lastMealType === 'Fruit meal') {
      mealHour = 1;
      mealMinutes = 0;
    } else if (lastMealType === 'Starch meal') {
      mealHour = 2;
      mealMinutes = 0;
    } else if (lastMealType === 'Protein meal') {
      mealHour = 4;
      mealMinutes = 0;
    } else {
      mealHour = mealInterval;
      mealMinutes = 0;
    }

    // As long as the last meal is 4 hours before sleep
    while (mealHour < bedTime - 8) {
      newMeal = new Meal();
      newMeal.time = moment({ 'hours': lastMealHour, 'minutes': lastMealMinutes })
        .add({ 'hours': mealHour, 'minutes': mealMinutes })
        .format('hh:mm a');

      meals.push(newMeal);
      mealHour += mealInterval;
    }

    return meals;
    */

    return [];
  }

  /**
   * Updates the food item quantity and nutrients to the new serving size
   * @param {MealFoodItem} foodItem - The food item to update
   * @returns {void}
   */
  public changeQuantities(foodItem: MealFoodItem): void {
    // Reset the food details to their default state before changing
    let initialRatio: number = foodItem.quantity / 100;
    foodItem.quantity *= (+foodItem.servings / initialRatio);

    for (let nutrientKey in foodItem.nutrition) {
      foodItem.nutrition[nutrientKey].value *= (+foodItem.servings / initialRatio);
    }
  }

  /**
  * Verifies if a meal is proper
  * @param {Meal} meal The meal to check
  * @returns {Promise} Returns confirmation if the meal is or not healthy
  */
  public checkMeal(meal: Meal): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let mealComplexityWarning: WarningMessage = this._checkMealComplexity(meal.mealItems),
        mealPralWarning: WarningMessage = this._checkMealPral(meal.pral),
        mealServingWarning: WarningMessage = this._checkMealServing(meal.serving),
        mealSizeWarning: WarningMessage = this._checkMealSize(meal.quantity);

      meal.warnings = [...this._combiningSvc.checkCombining(meal.mealItems)];

      this._checkMealTastes(meal);

      if (!!mealComplexityWarning) {
        meal.warnings.push(mealComplexityWarning);
      }

      if (!!mealPralWarning) {
        meal.warnings.push(mealPralWarning);
      }

      if (!!mealServingWarning) {
        meal.warnings.push(mealServingWarning);
      }

      if (!!mealSizeWarning) {
        meal.warnings.push(mealSizeWarning);
      }

      if (!meal.warnings.length) {
        resolve(true);
      } else {
        reject(meal.warnings);
      }
    });
  }

  /**
   * Gets a specific meal from the meal plan
   * @param {number} mealIdx - The index of the meal in the meal plan
   * @returns {FirebaseObjectObservable} Returns an object observable that publishes the meal
   */
  public getMeal(mealIdx: number): FirebaseObjectObservable<Meal> {
    return this._af.database.object(`/meal-plans/${this._user.id}/${CURRENT_DAY}/meals/${mealIdx}`)
  }

  /**
   * Calculates the meal nutritional values based on the food items
   * @description Each user has specific daily nutrition requirements (DRI)
   * We must know how much (%) of the requirements a meal fulfills
   * @param {Array} items - The food items of the meal
   */
  public getMealNutrition(items: Array<MealFoodItem>): Nutrition {
    let nutrition: Nutrition = new Nutrition(),
      requirements: Nutrition = this._fitSvc.getProfile().requirements;
    items.forEach((item: MealFoodItem) => {

      // Sum the nutrients for each food item
      for (let nutrientKey in item.nutrition) {
        nutrition[nutrientKey].value += item.nutrition[nutrientKey].value;
      }
    });

    // Establish the meal's nutritional value, based on the user's nutritional requirements (%)
    for (let nutrientKey in nutrition) {
      nutrition[nutrientKey].value = Math.round((nutrition[nutrientKey].value * 100) / (requirements[nutrientKey].value || 1));
    }

    return nutrition;
  }

  /**
   * Gets the user's meal plan and verifies the meals
   * @returns {Observable} Returns the current day meal.
   */
  public getMealPlan(): Observable<MealPlan> {
    return this._mealPlan.map((mealPlan: MealPlan) => {
      let newMealPlan: MealPlan = mealPlan || new MealPlan();
      newMealPlan.meals = mealPlan.meals ? this._setupMeals(mealPlan.meals) : this._getMeals();
      return newMealPlan;
    });
  }

  /**
   * Gets the alkalinity of a meal, based on the impact of each food item quantity and pral value
   * @param {Array} items - The food items of the meal
   * @returns {number} Returns the pral of the meal
   */
  public getMealPral(items: Array<MealFoodItem>): number {
    return +(items.reduce((acc: number, item: MealFoodItem) => acc + (item.pral * item.servings), 0)).toFixed(2);
  }

  /**
   * Gets the size of the meal
   * @param {Array} items - The food items of the meal
   * @returns {number} Returns the quantity in grams of the meal
   */
  public getMealSize(items: Array<MealFoodItem>): number {
    return items.reduce((acc: number, item: MealFoodItem) => acc + item.quantity, 0);
  }

  public saveMeal(mealIdx: number, meal: Meal): void {
    this.getMeal(mealIdx).update({
      isCold: meal.isCold,
      isRaw: meal.isRaw,
      mealItems: meal.mealItems,
      nutrition: meal.nutrition,
      pral: meal.pral,
      quantity: meal.quantity,
      serving: meal.serving,
      tastes: meal.tastes,
      time: meal.time,
      type: meal.type,
      warnings: meal.warnings,
      wasNourishing: meal.wasNourishing
    });
  }

  /**
   * Gets the nutritional values of each selected food
   * @param {Array} items The selected food
   * @returns {Observable} Returns a stream of food reports
   */
  public serializeMealItems(items: Array<IFoodSearchResult>): Observable<MealFoodItem> {
    return new Observable((observer: Observer<MealFoodItem>) => items.forEach((item: IFoodSearchResult, idx: number) => this._foodDataSvc.getFoodReports$(item.ndbno).then((food: Food) => {
      observer.next(new MealFoodItem(food.group, food.name, food.ndbno, food.nutrition, food.pral, food.quantity, 1, food.tastes, food.type, food.unit));
      if (idx === items.length - 1) {
        observer.complete();
      }
    })));
  }
}