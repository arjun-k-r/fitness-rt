// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';
import { find, sortBy, uniqBy } from 'lodash';

// Models
import {
  Food,
  Goal,
  Meal,
  MealPlan,
  Nutrition,
  NutritionGoals,
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
      this._nutritionPvd.getDailyRequirements(authId).then((dailyRequirements: Nutrition) => {
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

  public checkBreakfastTimeAchievement(goals: NutritionGoals, mealPlan: MealPlan): boolean {
    const breakfastTimeGoal: number = moment.duration(goals.breakfastTime.value).asMinutes();
    const breakfastTime: number = moment.duration(mealPlan.meals[0].hour).asMinutes();
    if (goals.breakfastTime.isSelected) {
      if (breakfastTime => breakfastTimeGoal - 30) {
        return true;
      }
    } else {
      return true;
    }

    return false;
  }

  public checkDinnerTimeAchievement(goals: NutritionGoals, mealPlan: MealPlan): boolean {
    const dinnerTimeGoal: number = moment.duration(goals.dinnerTime.value).asMinutes();
    const dinnerTime: number = moment.duration(mealPlan.meals[mealNr - 1].hour).asMinutes();
    if (goals.dinnerTime.isSelected) {
      if (dinnerTime <= dinnerTimeGoal + 30) {
        return true;
      }
    } else {
      return true;
    }

    return false;
  }

  public checkFoodGroupsAchievement(goals: NutritionGoals, meal: Meal): boolean {
    let foodGroupRestrictionsAchieved: boolean = true;

    if (goals.foodGroupRestrictions.isSelected) {
      goals.foodGroupRestrictions.value.forEach((group: string) => {
        if (!!find(meal.foods, (food: Food) => food.group === group)) {
          foodGroupRestrictionsAchieved = false
        }
      });
    }

    return foodGroupRestrictionsAchieved;
  }

  public checkGoalAchievements(goals: NutritionGoals, mealPlan: MealPlan): boolean {
    let foodGroupRestrictionsAchieved: boolean = true,
      mealSizeAchieved: boolean = true;

    mealPlan.meals.forEach((meal: Meal) => {
      mealSizeAchieved = this.checkMealSizeAchievement(goals, meal);
      foodGroupRestrictionsAchieved = this.checkFoodGroupsAchievement(goals, meal);
    });

    return this.checkBreakfastTimeAchievement(goals, mealPlan) && this.checkDinnerTimeAchievement(goals, mealPlan) && foodGroupRestrictionsAchieved && this.checkIntervalAchievement(goals, mealPlan) && mealSizeAchieved && (goals.breakfastTime.isSelected || goals.dinnerTime.isSelected || goals.foodGroupRestrictions.isSelected || goals.mealInterval.isSelected || goals.mealSize.isSelected);
  }

  public checkGoodMeal(meal: Meal): boolean {
    return meal.combos.calmEating && meal.combos.feeling === 'Energy' && !meal.combos.overeating && meal.combos.slowEating;
  }

  public checkIntervalAchievement(goals: NutritionGoals, mealPlan: MealPlan): boolean {
    let initialMealTime: number,
      currentMealTime: number;

    for (let i = 1; i < mealPlan.meals.length - 1; i++) {
      initialMealTime = moment.duration(mealPlan.meals[i - 1].hour).asMinutes() / 60;
      currentMealTime = moment.duration(mealPlan.meals[i].hour).asMinutes() / 60;
      if (!(currentMealTime <= initialMealTime + +goals.mealInterval.value + 0.5 && currentMealTime >= initialMealTime + +goals.mealInterval.value - 0.5)) {
        return false;
      }
    }
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
        let nutrientPercentageIntake: number = mealPlan.nutrition[nutrientKey].value * 100 / (this._userRequirements[nutrientKey].value || 1);
        if (mealPlan.nutrition[nutrientKey].group !== 'Vitamins') {
          if (nutrientPercentageIntake > 125 || nutrientPercentageIntake < 75) {
            lifePoints -= 15;
          } else {
            lifePoints += 10;
          }
        } else {
          if (nutrientPercentageIntake < 75) {
            lifePoints -= 15;
          } else {
            lifePoints += 10;
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

  public checkMealPlanFoodIntolerance(intoleranceList: Food[] = [], meals: Meal[]): Food[] {
    let newIntoleranceList: Food[] = [],
      tempIntoleranceList: Food[] = [];
    meals.forEach((meal: Meal) => {
      if (meal.combos.calmEating && meal.combos.slowEating && !meal.combos.overeating && meal.combos.feeling !== 'Energy') {
        // Add new intolerated food
        meal.foods.forEach((food: Food | Recipe) => {
          if (food.hasOwnProperty('chef')) {
            newIntoleranceList = [...intoleranceList, ...this._getRecipeFoods([], (<Recipe>food).ingredients)];
          } else {
            newIntoleranceList = [...intoleranceList, <Food>food];
          }
        });
      } else if (meal.combos.feeling === 'Energy' && !!intoleranceList.length) {
        // Remove no longer intolerated food
        let mealRecipeIngredients: Food[];
        meal.foods.forEach((food: Food | Recipe) => {
          tempIntoleranceList = [...intoleranceList];
          if (food.hasOwnProperty('chef')) {
            mealRecipeIngredients = this._getRecipeFoods([], (<Recipe>food).ingredients);
            mealRecipeIngredients.forEach((ingredient: Food) => {
              tempIntoleranceList = [...intoleranceList];
              tempIntoleranceList.forEach((intoleratedFood: Food, idx: number) => {
                if (ingredient.name === intoleratedFood.name) {
                  intoleranceList = [...intoleranceList.slice(0, idx), ...intoleranceList.slice(idx + 1)];
                }
              });
            })
          } else {
            tempIntoleranceList.forEach((intoleratedFood: Food, idx: number) => {
              if (food.name === intoleratedFood.name) {
                intoleranceList = [...intoleranceList.slice(0, idx), ...intoleranceList.slice(idx + 1)];
              }
            });
          }
        });
      }
    });

    return uniqBy(newIntoleranceList, 'name');
  }

  public checkMealSizeAchievement(goals: NutritionGoals, meal: Meal): boolean {
    if (goals.mealSize.isSelected) {
      return meal.quantity <= +goals.mealSize.value + 50;
    } else {
      return true;
    }
  }

  public checkOvereating(meal: Meal, mealSizeGoal: Goal): boolean {
    if (mealSizeGoal.isSelected) {
      return meal.quantity > +mealSizeGoal.value + 50;
    }

    return meal.quantity > 700;
  }

  public getIntoleratedFoods$(authId: string): FirebaseListObservable<Food[]> {
    return this._db.list(`/food-intolerance/${authId}`);
  }

  public getMealPlan$(authId: string): FirebaseObjectObservable<MealPlan> {
    return this._db.object(`/meal-plan/${authId}/${CURRENT_DAY}`);
  }

  public getNutritionGoals$(authId: string): FirebaseObjectObservable<NutritionGoals> {
    return this._db.object(`/meal-plan/${authId}/goals`);
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

  public saveMealPlan(authId: string, mealPlan: MealPlan, weekLog: NutritionLog[], intoleratedFoods?: Food[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      this._db.object(`/lifepoints/${authId}/${CURRENT_DAY}/nutrition`).set(mealPlan.lifePoints)
        .then(() => {
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
          mealPlan.meals = sortBy(mealPlan.meals, (meal: Meal) => meal.hour);
          if (!intoleratedFoods) {
            Promise.all([
              this._db.object(`/nutrition-log/${authId}`).set(weekLog),
              this._db.object(`/meal-plan/${authId}/${CURRENT_DAY}`).set(mealPlan)
            ]).then(() => {
              resolve();
            }).catch((err: firebase.FirebaseError) => reject(err));
          } else {
            Promise.all([
              this._db.object(`/nutrition-log/${authId}`).set(weekLog),
              this._db.object(`/food-intolerance/${authId}`).set(intoleratedFoods),
              this._db.object(`/meal-plan/${authId}/${CURRENT_DAY}`).set(mealPlan)
            ]).then(() => {
              resolve();
            }).catch((err: firebase.FirebaseError) => reject(err));
          }
        })
        .catch((err: Error) => console.error(`Error storing energy consumption and life points: ${err.toString()}`));
    });
  }

  public saveNutritionGoals(authId: string, goals: NutritionGoals): firebase.Promise<void> {
    return this._db.object(`/meal-plan/${authId}/goals`).set(goals);
  }
}
