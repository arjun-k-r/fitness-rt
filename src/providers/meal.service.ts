// App
import { Injectable } from '@angular/core';
import { User } from '@ionic/cloud-angular';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/operator/map';

// Third-party
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import * as moment from 'moment';

// Models
import { Food, IFoodSearchResult, Meal, MealFoodItem, MealPlan, MealWarning, Nutrition, UserProfile } from '../models';

// Providers
import { FoodCombiningService } from './food-combining.service';
import { FoodDataService } from './food-data.service';
import { FoodService } from './food.service';
import { ProfileService } from './profile.service';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class MealService {
  private _mealPlan: FirebaseObjectObservable<MealPlan>;
  constructor(
    private _af: AngularFire,
    private _combiningSvc: FoodCombiningService,
    private _foodSvc: FoodService,
    private _foodDataSvc: FoodDataService,
    private _profileSvc: ProfileService,
    private _user: User
  ) {
    this._mealPlan = _af.database.object(`/meal-plans/${_user.id}/${CURRENT_DAY}`);
  }

  /**
   * Verifies if there are tastes not suitable for the users constitution
   * @ignore
   * @param {Array} foodItems The food items to check
   * @returns {boolean} Returns a list of recomendations if there are wrong tastes
   */
  private _checkTastes(foodItems: Array<MealFoodItem>): boolean {
    /**
     * Vata must avoid raw, dry, dehydrated, frozen, cold, uncooked foods, with caffeine, and alcohol
     */

    return true;
  }

  /**
   * @returns {Array} Returns the planned meals for the day by breakfast time and sleep time.
   */
  private _getMeals(): Array<Meal> {
    let profile: UserProfile = this._profileSvc.getProfile(),
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
  }


  /**
   * Reorganises the meals if the breakfast time is changed
   * @param {Array} meals The meals to reaorganise
   * @returns {Array} Returns the reaorganised meals
   */
  private _setupMeals(meals: Array<Meal>): Array<Meal> {
    let bedTime: number = +this._profileSvc.getProfile().sleepPlan.bedTime.split(':')[0] + 12,
      lastMealTime = +meals[meals.length - 1].time.split(':')[0],
      mealInterval: number = +this._profileSvc.getProfile().mealPlan.interval,
      mealTime: number = mealInterval,
      newMeal: Meal;

    // As long as the last meal is 2 hours before sleep
    while (mealTime < bedTime - 6) {
      newMeal = new Meal();
      newMeal.time = moment({ 'hours': lastMealTime, 'minutes': 0 })
        .add({ 'hours': mealTime, 'minutes': 0 })
        .format('hh:mm a');
      meals.push(newMeal);
      mealTime += mealInterval;
    }

    return meals;
  }

  /**
  * Verifies if a meal is proper
  * @param {Meal} meal The meal to check
  * @returns {Promise} Returns the resolved meal with its flags set
  */
  public checkMeal(meal: Meal): Promise<boolean> {
    return new Promise((resolve, reject) => {
      meal.warnings = this._combiningSvc.checkCombining(meal.mealItems);
      if (!meal.warnings.length) {
        resolve(true);
      } else {
        reject(meal.warnings);
      }
    });
    //this._checkTastes(meal.mealItems);
  }

  public getMealNutrition(items: Array<MealFoodItem>): Nutrition {
    let nutrition: Nutrition = new Nutrition();
    items.forEach((item: MealFoodItem) => {

    });
    return nutrition;
  }

  public getMeal(mealIdx: number): FirebaseObjectObservable<Meal> {
    return this._af.database.object(`/meal-plans/${this._user.id}/${CURRENT_DAY}/meals/${mealIdx}`)
  }

  /**
   * @returns {Observable} Returns the current day meal.
   */
  public getMealPlan(): Observable<MealPlan> {
    return this._mealPlan.map((mealPlan: MealPlan) => {
      let newMealPlan: MealPlan = mealPlan || new MealPlan();
      newMealPlan.meals = mealPlan.meals ? this._setupMeals(mealPlan.meals) : this._getMeals();
      return newMealPlan;
    });
  }

  public saveMeal(mealIdx: number, meal: Meal): void {
    this.getMeal(mealIdx).update({
      distress: meal.distress,
      mealItems: meal.mealItems,
      nutrition: meal.nutrition,
      pral: meal.pral,
      quantity: meal.quantity,
      serving: meal.serving,
      time: meal.time,
      warnings: meal.warnings
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