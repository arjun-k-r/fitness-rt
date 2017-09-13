// Angular
import { Injectable } from '@angular/core';

// Ionic
import { Storage } from '@ionic/storage';

// Firebase
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Food, Meal, MealPlan, Nutrition, Recipe } from '../../models';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class MealProvider {
  private _userRequirements: Nutrition;
  constructor(
    private _db: AngularFireDatabase,
    private _storage: Storage
  ) { }

  public calculateDailyNutrition(mealPlan: MealPlan): Promise<Nutrition> {
    return new Promise(resolve => {
      const nutrition = new Nutrition();
        this._storage.ready().then(() => {
          this._storage.get(`userRequirements-${CURRENT_DAY}`).then((dailyRequirements: Nutrition) => {
            this._userRequirements = dailyRequirements;
            for (let nutrientKey in nutrition) {
              nutrition[nutrientKey].value = Math.round((mealPlan.nutrition[nutrientKey].value * 100) / (dailyRequirements[nutrientKey].value || 1));
            }
            resolve(nutrition);
          }).catch((err: Error) => console.error(`Error getting user nutrition requirements: ${err}`));
        }).catch((err: Error) => console.error(`Error loading storage: ${err}`));
    });
  }

  public calculateMealNutrition(foods: (Food | Recipe)[]): Nutrition {
    const nutrition = new Nutrition();
    foods.forEach((food: Food | Recipe) => {
      for (let nutrientKey in nutrition) {
        nutrition[nutrientKey].value += (food.nutrition[nutrientKey].value * food.servings);
      }
    });

    return nutrition;
  }

  public calculateMealQuantity(foods: (Food | Recipe)[]): number {
    return foods.reduce((quantity: number, food: Food | Recipe) => quantity + (food.quantity * food.servings), 0);
  }

  public calculateMealPlanNutrition(meals: Meal[]): Nutrition {
    const nutrition = new Nutrition();
    meals.forEach((meal: Meal) => {
      for (let nutrientKey in nutrition) {
        nutrition[nutrientKey].value += meal.nutrition[nutrientKey].value;
      }
    });

    return nutrition;
  }

  public calculateNutrientPercentage(nutrientPartial: number, nutrientName: string): number {
    return Math.round((nutrientPartial * 100) / (this._userRequirements && this._userRequirements[nutrientName].value || 1));
  }

  public getMealPlan$(authId: string): FirebaseObjectObservable<MealPlan> {
    return this._db.object(`/meal-plan/${authId}/${CURRENT_DAY}`);
  }

  public saveMealPlan(authId: string, mealPlan: MealPlan): firebase.Promise<void> {
    mealPlan.nutrition = this.calculateMealPlanNutrition(mealPlan.meals);
    return this._db.object(`/meal-plan/${authId}/${CURRENT_DAY}`).set(mealPlan);
  }
}
