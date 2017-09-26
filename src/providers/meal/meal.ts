// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import { Storage } from '@ionic/storage';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';
import { sortBy } from 'lodash';

// Models
import {
  Fitness,
  Food,
  Meal,
  MealPlan,
  Nutrition,
  NutritionLog,
  Recipe
} from '../../models';

// Providers
import { FitnessProvider } from '../fitness/fitness';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class MealProvider {
  private _userRequirements: Nutrition;
  constructor(
    private _db: AngularFireDatabase,
    private _fitPvd: FitnessProvider,
    private _storage: Storage
  ) { }

  private _getRecipeFoods(foods: Food[], ingredients: (Food | Recipe)[]): Food[] {
    ingredients.forEach((food: Food | Recipe) => {
      if (food.hasOwnProperty('chef')) {
        foods = [...this._getRecipeFoods(foods, (<Recipe>food).ingredients)];
      } else {
        foods = [...foods, (<Food>food)];
      }
    });

    return foods;
  }

  public calculateDailyNutrition(authId: string, mealPlan: MealPlan): Promise<Nutrition> {
    return new Promise((resolve, reject) => {
      const nutrition = new Nutrition();
      this._storage.ready().then(() => {
        this._storage.get(`userRequirements-${CURRENT_DAY}`).then((dri: Nutrition) => {
          if (!!dri) {
            this._userRequirements = dri;
            for (let nutrientKey in mealPlan.nutrition) {
              nutrition[nutrientKey].value = Math.round((mealPlan.nutrition[nutrientKey].value * 100) / (dri[nutrientKey].value || 1));
              resolve(nutrition);
            }
          } else {
            const subscription: Subscription = this._fitPvd.getFitness$(authId).subscribe((fitness: Fitness) => {
              this._storage.set(`userRequirements-${CURRENT_DAY}`, fitness.requirements).then(() => {
                this._userRequirements = fitness.requirements;
                for (let nutrientKey in mealPlan.nutrition) {
                  nutrition[nutrientKey].value = Math.round((mealPlan.nutrition[nutrientKey].value * 100) / (fitness.requirements[nutrientKey].value || 1));
                }
                subscription.unsubscribe();
                resolve(nutrition);
              }).catch((err: Error) => reject(err));
            }, (err: firebase.FirebaseError) => reject(err.message));
          }
        }).catch((err: Error) => reject(err));
      }).catch((err: Error) => reject(err));
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

  public checkLifePoints(mealPlan: MealPlan): number {
    let lifePoints: number = 0;
    mealPlan.meals.forEach((meal: Meal) => {
      if (meal.combos.calmEating) {
        lifePoints += 5;
      } else {
        lifePoints -= 5;
      }

      if (meal.combos.feeling === 'Energy') {
        lifePoints += 15;
      } else {
        lifePoints -= 15;
      }

      if (meal.combos.slowEating) {
        lifePoints += 5;
      } else {
        lifePoints -= 5;
      }

      if (!meal.combos.overeating) {
        lifePoints += 15;
      } else {
        lifePoints -= 15;
      }
    });

    if (this._userRequirements) {
      for (let nutrientKey in mealPlan.nutrition) {
        if (mealPlan.nutrition[nutrientKey].group !== 'Vitamins') {
          let nutrientPercentageIntake: number = mealPlan.nutrition[nutrientKey].value * 100 / (this._userRequirements[nutrientKey].value || 1);
          if (nutrientPercentageIntake > 115 || nutrientPercentageIntake < 75) {
            lifePoints -= 15;
          } else {
            lifePoints -= 10;
          }
        }
      }
    }

    return lifePoints;
  }

  public checkMealFoodAntinutrients(foundAntinutrientFoods: Food[], foods: (Food | Recipe)[]): Food[] {
    foods.forEach((food: Food | Recipe) => {
      if (food.hasOwnProperty('chef')) {
        foundAntinutrientFoods = [...this.checkMealFoodAntinutrients(foundAntinutrientFoods, (<Recipe>food).ingredients)];
      } else if ((<Food>food).group === 'Cereal Grains and Pasta' || (<Food>food).group === 'Legumes and Legume Products' || (<Food>food).group === 'Nut and Seed Products') {
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
        let intolerantFood: Food = intoleranceList.filter((intolerance: Food) => intolerance.name === food.name)[0];
        if (!!intolerantFood) {
          foundIntolerance = [...foundIntolerance, intolerantFood];
        }
      }
    });

    return foundIntolerance;
  }

  public checkMealPlanFoodIntolerance(mealPlan: MealPlan): Food[] {
    let newIntoleranceList: Food[] = [],
      tempIntoleranceList: Food[] = [];
    mealPlan.intoleranceList = mealPlan.intoleranceList || [];
    mealPlan.meals.forEach((meal: Meal) => {
      if (meal.combos.calmEating && meal.combos.slowEating && !meal.combos.overeating && meal.combos.feeling !== 'Energy') {
        // Add new intolerated food
        meal.foods.forEach((food: Food | Recipe) => {
          if (food.hasOwnProperty('chef')) {
            newIntoleranceList = [...mealPlan.intoleranceList, ...this._getRecipeFoods([], (<Recipe>food).ingredients)];
          } else  {
            console.log(mealPlan.intoleranceList.filter((intoleration: Food) => food.name === intoleration.name))
            if (!mealPlan.intoleranceList.filter((intoleration: Food) => food.name === intoleration.name)[0]) {
              newIntoleranceList = [...mealPlan.intoleranceList, <Food>food];
            }
          }
        });
      } else if (meal.combos.feeling === 'Energy' && mealPlan.intoleranceList.length) {
        // Remove no longer intolerated food
        let mealRecipeIngredients: Food[];
        meal.foods.forEach((food: Food | Recipe) => {
          tempIntoleranceList = [...mealPlan.intoleranceList];
          if (food.hasOwnProperty('chef')) {
            mealRecipeIngredients = this._getRecipeFoods([], (<Recipe>food).ingredients);
            mealRecipeIngredients.forEach((ingredient: Food) => {
              tempIntoleranceList = [...mealPlan.intoleranceList];
              tempIntoleranceList.forEach((intoleratedFood: Food, idx: number) => {
                if (ingredient.name === intoleratedFood.name) {
                  mealPlan.intoleranceList = [...mealPlan.intoleranceList.slice(0, idx), ...mealPlan.intoleranceList.slice(idx + 1)];
                }
              });
            })
          } else {
            tempIntoleranceList.forEach((intoleratedFood: Food, idx: number) => {
              if (food.name === intoleratedFood.name) {
                mealPlan.intoleranceList = [...mealPlan.intoleranceList.slice(0, idx), ...mealPlan.intoleranceList.slice(idx + 1)];
              }
            });
          }
        });
      }
    });

    return newIntoleranceList;
  }

  public checkOvereating(meal: Meal): boolean {
    return meal.quantity > 700;
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

  public saveMealPlan(authId: string, mealPlan: MealPlan, weekLog: NutritionLog[]): firebase.Promise<void> {
    this._storage.ready().then(() => {
      this._storage.set(`nutritionLifePoints-${CURRENT_DAY}`, mealPlan.lifePoints)
        .catch((err: Error) => console.error(`Error storing nutrition lifepoints: ${err.toString()}`));
    }).catch((err: Error) => console.error(`Error loading storage: ${err.toString()}`));
    const newNutritionLog: NutritionLog = new NutritionLog(moment().format('dddd'), mealPlan.nutrition);
    if (!!weekLog.length) {
     if (newNutritionLog.date !== weekLog[0].date) {
      this._db.list(`/nutrition-log/${authId}/`).push(newNutritionLog).catch((err: firebase.FirebaseError) => console.error(`Error saving nutrition log: ${err.message}`));
     } else {
      this._db.list(`/nutrition-log/${authId}/`).update(weekLog[0]['$key'], newNutritionLog).catch((err: firebase.FirebaseError) => console.error(`Error saving nutrition log: ${err.message}`));
     }
    } else {
      this._db.list(`/nutrition-log/${authId}/`).push(newNutritionLog).catch((err: firebase.FirebaseError) => console.error(`Error saving nutrition log: ${err.message}`));
    }
    return this._db.object(`/meal-plan/${authId}/${CURRENT_DAY}`).set(mealPlan);
  }

  public sortMeals(meals: Meal[]): Meal[] {
    return sortBy(meals, (meal: Meal) => meal.hour);
  }
}
