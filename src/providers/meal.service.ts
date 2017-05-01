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
import {
  Food,
  IFoodSearchResult,
  Meal,
  MealFoodItem,
  MealPlan,
  MealServing,
  NutrientDeficiencies,
  NutrientExcesses,
  Nutrition,
  SleepPlan,
  WarningMessage
} from '../models';

// Providers
import { FitnessService } from './fitness.service'
import { FoodCombiningService } from './food-combining.service';
import { FoodDataService } from './food-data.service';
import { FoodService } from './food.service';
import { NutritionService } from './nutrition.service';
import { SleepService } from './sleep.service';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class MealService {
  private _bedTime: string;
  private _currentMealPlan: FirebaseObjectObservable<MealPlan>;
  private _lastMealPlan: FirebaseObjectObservable<MealPlan>;
  private _nutritionRequirements: Nutrition;
  constructor(
    private _af: AngularFire,
    private _combiningSvc: FoodCombiningService,
    private _fitSvc: FitnessService,
    private _foodSvc: FoodService,
    private _foodDataSvc: FoodDataService,
    private _nutritionSvc: NutritionService,
    private _sleepSvc: SleepService,
    private _user: User
  ) {
    _sleepSvc.getSleepPlan$().subscribe((sleePlan: SleepPlan) => this._bedTime = moment(_sleepSvc.getCurrentSleep(sleePlan).bedTime, 'hours').format('HH:mm'));
    this._currentMealPlan = _af.database.object(`/meal-plans/${_user.id}/${CURRENT_DAY}`);
    this._lastMealPlan = _af.database.object(`/meal-plans/${_user.id}/${CURRENT_DAY - 1}`);
    this._nutritionRequirements = _fitSvc.getUserRequirements();
  }

  /**
   * Verifies if the meal does not exceed the limit amount of carbohydrates
   * @param {Nutrition} nutrition - The meal nutrition
   * @returns {WarningMessage} Returns warning if the meal has too much carbohydrate
   */
  // private _checkMealCarbs(nutrition: Nutrition): WarningMessage {
  //   return nutrition.carbs.value > nutrition.energy.value * 0.5 ? new WarningMessage(
  //     'Too much carbohydrate',
  //     `The meal should contain no more than ${nutrition.energy.value * 0.5}% carbohydrate (50% of meal energy)`
  //   ) : null;
  // }

  /**
   * Verifies if the meal is too complex for digestion (has more than 8 food items)
   * @param {Array} foodItems - The food items of the meal
   * @returns {WarningMessage} Returns warning if the meal is too complex
   */
  private _checkMealComplexity(foodItems: Array<MealFoodItem>): WarningMessage {
    return foodItems.length > 8 ? new WarningMessage(
      'The meal is too complex!',
      'More than 6 food items in a signle meal makes it complex and difficult to digest, as it requires many types of enzymes, gastric juices, and timings.'
    ) : null;
  }

  /**
   * Verifies if the meal does not exceed the limit amount of calories
   * @param {Nutrition} nutrition - The meal nutrition
   * @returns {WarningMessage} Returns warning if the meal supplies too much energy
   */
  // private _checkMealEnergy(nutrition: Nutrition): WarningMessage {
  //   return nutrition.energy.value * this._nutritionRequirements.energy.value / 100 > 750 ? new WarningMessage(
  //     'Too many calories',
  //     `The meal should contain no more than ${750 * 100 / this._nutritionRequirements.energy.value}% calories`
  //   ) : null;
  // }

  /**
   * Verifies if the meal does not exceed the limit amount of fats
   * @param {Nutrition} nutrition - The meal nutrition
   * @returns {WarningMessage} Returns warning if the meal has too much fat
   */
  // private _checkMealFats(nutrition: Nutrition): WarningMessage {
  //   return nutrition.fats.value > nutrition.energy.value * 0.3 ? new WarningMessage(
  //     'Too much fat',
  //     `The meal should contain no more than ${nutrition.energy.value * 0.3}% fat (30% of meal energy)`
  //   ) : null;
  // }

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
  // private _checkMealProtein(nutrition: Nutrition): WarningMessage {
  //   return nutrition.fats.value > nutrition.energy.value * 0.2 ? new WarningMessage(
  //     'Too much protein',
  //     `The meal should contain no more than ${nutrition.energy.value * 0.2}% protein (20% of meal energy)`
  //   ) : null;
  // }

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
   * Verifies if the meal does not exceed the limit amount of sugar
   * @param {Nutrition} nutrition - The meal nutrition
   * @returns {WarningMessage} Returns warning if the meal has too much sugar
   */
  // private _checkMealSugars(nutrition: Nutrition): WarningMessage {
  //   return nutrition.sugars.value > nutrition.energy.value * 0.1 ? new WarningMessage(
  //     'Too much sugar',
  //     `The meal should contain no more than ${nutrition.energy.value * 0.1}% sugar (10% of meal energy)`
  //   ) : null;
  // }

  /**
   * Increments the meal tastes by one for each food item containing a specific taste
   * @description According to Ayurveda, a balanced meal contains all six tastes in order to completely nourish and satisfy the body.
   * @param {Meal} meal - The meal to check
   */
  private _checkMealTastes(meal: Meal): void {
    meal.mealItems.forEach((item: MealFoodItem) => item.tastes.forEach((taste: string) => meal.tastes[taste.toLocaleLowerCase()]++));
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
  * @param {number} mealIdx The meal index to check
  * @param {Array} mealPlan The meal index to check
  * @returns {Promise} Returns confirmation if the meal is or not healthy
  */
  public checkMeal(mealIdx: number, meals: Array<Meal>): Promise<boolean> {
    let meal: Meal = meals[mealIdx];
    return new Promise((resolve, reject) => {
      let //mealCarbsWarning: WarningMessage = this._checkMealCarbs(meal.nutrition),
        mealComplexityWarning: WarningMessage = this._checkMealComplexity(meal.mealItems),
        //mealEnergyWarning: WarningMessage = this._checkMealEnergy(meal.nutrition),
        //mealFatsWarning: WarningMessage = this._checkMealFats(meal.nutrition),
        mealHourWarning: WarningMessage = this.checkMealHour(mealIdx, meals),
        mealPralWarning: WarningMessage = this._checkMealPral(meal.pral),
        //mealProteinWarning: WarningMessage = this._checkMealProtein(meal.nutrition),
        mealServingWarning: WarningMessage = this._checkMealServing(meal.serving),
        mealSizeWarning: WarningMessage = this._checkMealSize(meal.quantity);
      //mealSugarsWarning: WarningMessage = this._checkMealSugars(meal.nutrition);

      meal.warnings = [...this._combiningSvc.checkCombining(meal.mealItems)];

      this._checkMealTastes(meal);

      // if (!!mealCarbsWarning) {
      //   meal.warnings.push(mealCarbsWarning);
      // }

      if (!!mealComplexityWarning) {
        meal.warnings.push(mealComplexityWarning);
      }

      // if (!!mealFatsWarning) {
      //   meal.warnings.push(mealFatsWarning);
      // }

      if (!!mealHourWarning) {
        meal.warnings.push(mealHourWarning);
      }

      if (!!mealPralWarning) {
        meal.warnings.push(mealPralWarning);
      }

      // if (!!mealProteinWarning) {
      //   meal.warnings.push(mealProteinWarning);
      // }

      if (!!mealServingWarning) {
        meal.warnings.push(mealServingWarning);
      }

      if (!!mealSizeWarning) {
        meal.warnings.push(mealSizeWarning);
      }

      // if (!!mealSugarsWarning) {
      //   meal.warnings.push(mealSugarsWarning);
      // }

      if (!meal.warnings.length) {
        resolve(true);
      } else {
        reject(meal.warnings);
      }
    });
  }

  /**
   * Verifies if the meal serving time is proper
   * @description Meals need to be timed by the previous meal digestion duration
   * 1. Fluids need at least 15 minutes to pass through the intestines
   * 2. Melons require 30 minutes of digestion
   * 3. Fruits require 30-60 minutes of digestion
   * 4. Starch requires 2 hours of digestion
   * 5. Protein requires 4 hours of digestion
   * @param {number} mealIdx - The index of the meal in the current day meal plan meals
   * @param {Array} meals - The current day meals
   * @returns {WarningMessage} Returns a warning if the hour is not proper
   */
  public checkMealHour(mealIdx: number, meals: Array<Meal>): WarningMessage {
    let warning: WarningMessage;

    if (moment(this._bedTime, 'hours').subtract(moment(meals[mealIdx].time, 'hours').hours(), 'hours').hours() < 4) {
      warning = new WarningMessage(
        'The meal is served too late',
        'Try no to eat 4 hours before bed, so that your digestion completes before you go to sleep'
      );
    } else if (mealIdx !== 0) {
      if (moment(meals[mealIdx - 1].time, 'hours').subtract(moment(meals[mealIdx].time, 'hours').hours(), 'hours').hours() >= 0) {
        warning = new WarningMessage(
          'A meal cannot be planned before or over an already planned meal',
          'Make sure you plan your meals chronologically, one by one'
        );
      } else {
        meals[mealIdx - 1].mealItems.every((item: MealFoodItem) => {
          if (item.type.toLocaleLowerCase().includes('protein')) {
            if (moment(meals[mealIdx].time, 'hours').subtract(moment(meals[mealIdx - 1].time, 'hours').hours(), 'hours').hours() < 3) {
              warning = new WarningMessage(
                'The previous meal is not digested yet',
                'Concentrated protein meals require at least 3 hours of digestion'
              );
            }

            return true;
          } else if (item.type === 'Starch') {
            if (moment(meals[mealIdx].time, 'hours').subtract(moment(meals[mealIdx - 1].time, 'hours').hours(), 'hours').hours() < 2) {
              warning = new WarningMessage(
                'The previous meal is not digested yet',
                'Concentrated carbohydrate meals require at least 2 hours of digestion'
              );
            }

            return true;
          } else if (item.type.toLocaleLowerCase().includes('fruit')) {
            if (moment(meals[mealIdx].time, 'hours').subtract(moment(meals[mealIdx - 1].time, 'hours').hours(), 'hours').hours() < 1) {
              warning = new WarningMessage(
                'The previous meal is not digested yet',
                'Fruit meals require at least 1 hour of digestion'
              );
            }

            return true;
          } else if (item.type === 'Melon') {
            if (moment.duration(meals[mealIdx].time).asMinutes() - moment.duration(meals[mealIdx - 1].time).asMinutes() < 30) {
              warning = new WarningMessage(
                'The previous meal is not digested yet',
                'Melons require at least 30 minutes of digestion'
              );
            }

            return true;
          } else if (item.type === 'Fluid') {
            if (moment.duration(meals[mealIdx].time).asMinutes() - moment.duration(meals[mealIdx - 1].time).asMinutes() < 15) {
              warning = new WarningMessage(
                'Fluids dillute the gastric juices required for digestion',
                'Fluids require at least 15 minutes to pass through the digestive tracts'
              );
            }

            return true;
          }
        });
      }
    }

    return warning;
  }

  /**
   * Calculates the meal nutritional values based on the food items
   * @param {Array} items - The food items of the meal
   * @returns {Nutrition} Returns the meal nutrition
   */
  public getMealNutrition(items: Array<MealFoodItem>): Nutrition {
    let nutrition: Nutrition = new Nutrition();
    items.forEach((item: MealFoodItem) => {

      // Sum the nutrients for each meal item
      for (let nutrientKey in item.nutrition) {
        nutrition[nutrientKey].value += item.nutrition[nutrientKey].value;
        nutrition[nutrientKey].value = +(nutrition[nutrientKey].value).toFixed(2);
      }
    });

    return nutrition;
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

          // Get the previous day meal plan to check for deficiencies and excesses
          this._lastMealPlan.subscribe((lastMealPlan: MealPlan) => {
            if (!lastMealPlan.hasOwnProperty('$value')) {
              let prevDeficiencies: NutrientDeficiencies = this._nutritionSvc.getNutritionDeficiencies(lastMealPlan.dailyNutrition),
                prevExcesses: NutrientExcesses = this._nutritionSvc.getNutritionExcesses(lastMealPlan.dailyNutrition);

              // Add the deficiencies of the last meal plan, along with those from previous meal plans or reset them if the previous meal plan fulfilled the requirements the previous day
              for (let nutrientKey in prevDeficiencies) {
                newMealPlan.deficiency[nutrientKey] = prevDeficiencies[nutrientKey] === 1 ? prevDeficiencies[nutrientKey] + lastMealPlan.deficiency[nutrientKey] : 0;
              }

              // Add the excesses of the last meal plan, along with those from previous meal plans or reset them if the previous meal plan did no longer exceed the requirements the previous day
              // We need to count the days of excesses
              for (let nutrientKey in prevExcesses) {
                newMealPlan.excess[nutrientKey] = prevExcesses[nutrientKey] === 1 ? prevExcesses[nutrientKey] + lastMealPlan.excess[nutrientKey] : 0;
              }
            }

            observer.next(newMealPlan);
            observer.complete();
          });
        } else {
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
    return this._nutritionSvc.getNutritionTotal(meals, true);
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

  /**
   * Saves the updated meal in the current meal plan
   * @param {Meal} meal - The updated meal
   * @param {number} mealIdx - The index of the meal in the current meal plan
   * @param {MealPlan} mealPlan - The meal plan to save
   * @returns {void}
   */
  public saveMeal(meal: Meal, mealIdx: number, mealPlan: MealPlan): void {
    meal.nutrition = this.getMealNutrition(meal.mealItems);
    mealPlan.meals[mealIdx] = meal;
    mealPlan.dailyNutrition = this.getMealPlanNutrition(mealPlan.meals);
    console.log('Saving meal plan: ', mealPlan);

    this._currentMealPlan.update({
      dailyNutrition: mealPlan.dailyNutrition,
      date: mealPlan.date,
      deficiency: mealPlan.deficiency,
      excess: mealPlan.excess,
      meals: mealPlan.meals
    });
  }

  /**
   * Gets the nutritional values of each selected food
   * @param {Array} items The selected food
   * @returns {Observable} Returns a stream of food reports
   */
  public serializeMealItems(items: Array<IFoodSearchResult>): Promise<Array<MealFoodItem>> {
    let requests: Array<Promise<Food>> = [];

    items.forEach((item: IFoodSearchResult, idx: number) => requests.push(this._foodDataSvc.getFoodReports$(item.ndbno)));
    return Promise.all(requests);
  }
}