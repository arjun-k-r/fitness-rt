// Angular
import { Injectable } from '@angular/core';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import {
  Food,
  Meal,
  MealPlan,
  Nutrition,
  NutritionLog,
  Recipe
} from '../../models';

// Providers
import { NutritionProvider } from '../nutrition/nutrition';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class MealProvider {
  private _userRequirements: Nutrition;
  constructor(
    private _db: AngularFireDatabase,
    private _nutritionPvd: NutritionProvider
  ) { }

  public calculateDailyNutrition(authId: string, mealPlan: MealPlan): Promise<Nutrition> {
    return new Promise((resolve, reject) => {
      const nutrition = new Nutrition();
      this._nutritionPvd.getRequirements(authId).then((dailyRequirements: Nutrition) => {
        dailyRequirements = dailyRequirements['$value'] === null ? new Nutrition() : dailyRequirements;
        this._userRequirements = dailyRequirements;
        for (let nutrientKey in mealPlan.nutrition) {
          nutrition[nutrientKey].value = Math.round((mealPlan.nutrition[nutrientKey].value * 100) / (dailyRequirements[nutrientKey].value || 1));
        }
        resolve(nutrition);
      }).catch((err: firebase.FirebaseError) => reject(err.message));
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
        // Minerals and vitamins are easily degreaded and not completely absorbed
        if (meal.nutrition[nutrientKey].group === 'Vitamins' || meal.nutrition[nutrientKey].group === 'Minerals') {
          nutrition[nutrientKey].value += meal.nutrition[nutrientKey].value * 0.5;
        } else {
          nutrition[nutrientKey].value += meal.nutrition[nutrientKey].value;
        }
      }
    });

    return nutrition;
  }

  public calculateNutrientPercentage(nutrientPartial: number, nutrientName: string): number {
    return Math.round((nutrientPartial * 100) / (this._userRequirements && this._userRequirements[nutrientName].value || 1));
  }

  public checkMealFoodAntinutrients(foundAntinutrientFoods: Food[], foods: (Food | Recipe)[]): Food[] {
    foods.forEach((food: Food | Recipe) => {
      if (food.hasOwnProperty('chef')) {
        foundAntinutrientFoods = [...this.checkMealFoodAntinutrients(foundAntinutrientFoods, (<Recipe>food).ingredients)];
      } else if (((<Food>food).group === 'Cereal Grains and Pasta' || (<Food>food).group === 'Legumes and Legume Products' || (<Food>food).group === 'Nut and Seed Products') && (<Food>food).name.includes('raw')) {
        foundAntinutrientFoods = [...foundAntinutrientFoods, <Food>food];
      }
    });

    return foundAntinutrientFoods;
  }

  public checkMealFoodIntolerance(foundIntolerance: Food[], foods: (Food | Recipe)[], intoleranceList: Food[] = []): Food[] {
    foods.forEach((food: Food | Recipe) => {
      if (food.hasOwnProperty('chef')) {
        foundIntolerance = [...this.checkMealFoodIntolerance(foundIntolerance, (<Recipe>food).ingredients, intoleranceList)];
      } else {
        let intolerantFood: Food = intoleranceList.filter((intolerance: Food) => intolerance.name === food.name || food.name.includes(intolerance.name.split(',')[0]))[0];
        if (!!intolerantFood) {
          foundIntolerance = [...foundIntolerance, intolerantFood];
        }
      }
    });

    return foundIntolerance;
  }

  public getIntoleratedFoods$(authId: string): FirebaseListObservable<Food[]> {
    return this._db.list(`/food-intolerance/${authId}`);
  }

  public getMealPlan$(authId: string): FirebaseObjectObservable<MealPlan> {
    return this._db.object(`/meal-plan/${authId}/${CURRENT_DAY}`);
  }

  public getNutritionLog$(authId: string): FirebaseListObservable<NutritionLog[]> {
    return this._db.list(`/nutrition-log/${authId}/`, {
      query: {
        limitToLast: 7
      }
    });
  }

  public getPrevMealPlan$(authId: string): FirebaseObjectObservable<MealPlan> {
    return this._db.object(`/meal-plan/${authId}/${CURRENT_DAY - 1}`);
  }

  public getRecipeFoods(foods: Food[], ingredients: (Food | Recipe)[]): Food[] {
    ingredients.forEach((food: Food | Recipe) => {
      if (food.hasOwnProperty('chef')) {
        foods = [...this.getRecipeFoods(foods, (<Recipe>food).ingredients)];
      } else {
        foods = [...foods, (<Food>food)];
      }
    });

    return foods;
  }

  public saveIntoleratedFoods(authId: string, foods: Food[]): Promise<void> {
    return this._db.object(`/food-intolerance/${authId}`).set(foods);
  }

  public saveMealPlan(authId: string, mealPlan: MealPlan, weekLog: NutritionLog[], intoleratedFoods?: Food[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      const newNutritionLog: NutritionLog = new NutritionLog(moment().format('dddd'), mealPlan.nutrition);
      const weekLength: number = weekLog.length;
      if (!!weekLength) {
        if (newNutritionLog.date !== weekLog[weekLength - 1].date) {
          weekLog.push(newNutritionLog);
        } else {
          weekLog[weekLength - 1] = Object.assign({}, newNutritionLog);
        }
      } else {
        weekLog.push(newNutritionLog);
      }
      if (!intoleratedFoods) {
        Promise.all([
          this._db.object(`/nutrition-log/${authId}`).set(weekLog),
          this._db.object(`/meal-plan/${authId}/${CURRENT_DAY}`).set(mealPlan),
        ]).then(() => {
          resolve();
        }).catch((err: firebase.FirebaseError) => reject(err));
      } else {
        Promise.all([
          this._db.object(`/nutrition-log/${authId}`).set(weekLog),
          this._db.object(`/food-intolerance/${authId}`).set(intoleratedFoods),
          this._db.object(`/meal-plan/${authId}/${CURRENT_DAY}`).set(mealPlan),
        ]).then(() => {
          resolve();
        }).catch((err: firebase.FirebaseError) => reject(err));
      }
    });
  }
}
