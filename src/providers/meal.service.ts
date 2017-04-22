// App
import { Injectable } from '@angular/core';
import { User } from '@ionic/cloud-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/operator/map';

// Third-party
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import * as moment from 'moment';

// Models
import { Food, IFoodSearchResult, Meal, MealFoodItem, MealPlan, MealWarning, Nutrition, UserProfile } from '../models';

// Providers
import { FoodDataService } from './food-data.service';
import { FoodService } from './food.service';
import { ProfileService } from './profile.service';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class MealService {
  private _mealPlan: FirebaseObjectObservable<MealPlan>;
  constructor(
    private _af: AngularFire,
    private _foodSvc: FoodService,
    private _foodDataSvc: FoodDataService,
    private _profileSvc: ProfileService,
    private _user: User
  ) {
    this._mealPlan = _af.database.object(`/meal-plans/${_user.id}/${CURRENT_DAY}`);
  }

  /**
   * Verifies if the food items in a meal are well combined
   * @param {Array} foodItems The food items to check
   * @returns {Array} Returns a list of warnings if there are wrong combinations
   */
  private _checkCombining(foodItems: Array<MealFoodItem>): Array<MealWarning> {
    let acidFruits: Array<MealFoodItem> = [],
      fats: Array<MealFoodItem> = [],
      hasAcids: boolean = false,
      hasFluids: boolean = false,
      hasMelon: boolean = false,
      hasMilk: boolean = false,
      hasSugars: boolean = false,
      proteins: Array<MealFoodItem> = [],
      starches: Array<MealFoodItem> = [],
      subAcidFruits: Array<MealFoodItem> = [],
      sweetFruits: Array<MealFoodItem> = [],
      veggies: Array<MealFoodItem> = [],
      warnings: Array<MealWarning> = [];

    foodItems.forEach((item: MealFoodItem) => {

      // Check the food type
      switch (item.type) {
        case 'acid':
          hasAcids = true;
          break;

        case 'acid fruit':
          acidFruits.push(item);
          break;

        case 'fat':
          fats.push(item);
          break;

        case 'fluid':
          hasFluids = true;
          break;

        case 'melon':
          hasMelon = true;
          break;

        case 'milk':
          hasMilk = true;
          break;

        case 'protein':
          proteins.push(item);
          break;

        case 'starch':
          starches.push(item);
          break;

        case 'sub-acid fruit':
          subAcidFruits.push(item);
          break;

        case 'sugar':
          hasSugars = true;
          break;

        case 'sweet fruit':
          sweetFruits.push(item);
          break;

        case 'veggie':
          veggies.push(item);
          break;

        default:
          break;
      }
    });

    /**
     * Rule #1
     * Not Starch-Protein
     */
    if (!!starches.length && !!proteins.length) {
      warnings.push(
        new MealWarning(
          false,
          'No starch and protein at the same meal!',
          'Starch digestion requires alkaline medium, whereas protein digestion require acid medium.'
        )
      );
    }

    /**
     * Rule #2
     * Not Starch-Acid
     */
    if (!!starches.length && hasAcids) {
      warnings.push(
        new MealWarning(
          false,
          'No starch and acid at the same meal!',
          'Starch digestion requires alkaline medium, whereas acid digestion require acid medium.'
        )
      );
    }

    /**
     * Rule #3
     * Not Protein-Protein of different families
     */
    if (proteins.length > 1 && proteins[0].group !== proteins[1].group) {
      warnings.push(
        new MealWarning(
          false,
          'No more than one type of protein at the same meal!',
          'Each kind of protein requires different digestive secretion timings and preparations'
        )
      );
    }

    /**
     * Rule #4
     * Not Acid-Protein
     */
    if (hasAcids && !!proteins.length) {
      warnings.push(
        new MealWarning(
          false,
          'No acid and protein at the same meal!',
          'Pepsin, the enzyme required for protein digestion, is inhibited or destroyed by excess stomach acidity'
        )
      );
    }

    /**
     * Rule #5
     * Not Fat-Protein
     */
    if (!!fats.length && !!proteins.length) {
      warnings.push(
        new MealWarning(
          false,
          'No fat and protein at the same meal!',
          'Fat inhibits gastric juice secretion and slow down digestion. Hence, fats also inhibit pepsin secretion, the enzyme required for protein digestion'
        )
      );
    }

    /**
     * Rule #6
     * Not Sugar-Protein
     */
    if ((hasSugars || !!sweetFruits) && !!proteins.length) {
      warnings.push(
        new MealWarning(
          false,
          'No sweets and protein at the same meal!',
          'Sugars do not undergo any sort of digestion in the mout or stomach, but only a brief digestion (30 minutes) in the small intestine. Protein holds sugars in the stomach (4 hours) and makes them ferment. Sugars also inhibit gastric juice secretion.'
        )
      );
    }

    /**
     * Rule #6
     * Not Sugar-Starch
     */
    if ((hasSugars || !!sweetFruits) && !!starches.length) {
      warnings.push(
        new MealWarning(
          false,
          'No sweets and starch at the same meal!',
          'Sugars do not undergo any sort of digestion in the mouth or stomach, but only a brief digestion (30 minutes) in the small intestine. Starch holds sugars in the stomach (2 hours) and makes them ferment. Sugars also inhibit ptyalin secretion, the enzyme from saliva required for starch digestion.'
        )
      );
    }

    /**
     * Rule #7
     * Melon alone
     */
    if (hasMelon && foodItems.length > 1) {
      warnings.push(
        new MealWarning(
          false,
          'Melons go alone or stay alone',
          'Melons do not undergo any sort of digestion in the mouth or stomach, but only a brief digestion (10 minutes) in the small intestine. Any other food would hold melons in the stomach and make them ferment.'
        )
      );
    }

    /**
     * Rule #8
     * Milk alone
     */
    if (hasMilk && foodItems.length > 1) {
      warnings.push(
        new MealWarning(
          false,
          'Milk goes alone or stays alone!',
          "Humans are the only species that drink another species' milk, even after infancy. Milk forms curds in the stomach which further suround particles of food, inhibiting the action of gastric juices upon them and preventing, thus, their digestion."
        )
      );
    }

    /**
     * Rule #9
     * Fluids alone
     */
    if (hasFluids && foodItems.length > 1) {
      warnings.push(
        new MealWarning(
          false,
          'No fluids after or during meals!',
          'Fluids dilute the gastric juices required for digestion.'
        )
      );
    }

    /**
     * Rule #10
     * Fruits alone
     */
    if ((!!acidFruits.length && acidFruits.length > foodItems.length) || (!!subAcidFruits.length && subAcidFruits.length > foodItems.length) || (!!sweetFruits.length && sweetFruits.length > foodItems.length)) {
      warnings.push(
        new MealWarning(
          false,
          'Fruits go alone or stay alone!',
          'Fruits undergo a brief digestion (30-60 minutes) in the small intestine. Any other food would hold fruit in the stomach and make them ferment.'
        )
      );
    }

    /**
     * Rule #11
     * Not Acid fruits - Sweet fruits
     */
    if (!!acidFruits.length && !!sweetFruits.length) {
      warnings.push(
        new MealWarning(
          false,
          'No acid fruit and sweet fruit at the same meal!',
          'Sweet fruit do not undergo any sort of digestion in the mouth or stomach, but only a brief digestion (30 minutes) in the small intestine. Acid fruit hold sweet fruit in the stomach and make them ferment. The sugar from sweet fruit also inhibit ptyalin secretion, the enzyme from saliva required for acid digestion.'
        )
      );
    }

    return warnings;
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
  * @returns {Meal} Returns the meal with its flags set
  */
  public checkMeal(meal: Meal): Meal {
    this._checkCombining(meal.mealItems);
    this._checkTastes(meal.mealItems);
    return meal;
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
    return new Observable(observer => items.forEach((item: IFoodSearchResult) => this._foodDataSvc.getFoodReports$(item.ndbno).then((food: Food) => observer.next(new MealFoodItem(food.group, food.name, food.ndbno)))));
  }
}