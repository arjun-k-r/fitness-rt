// Angular
import { Injectable } from '@angular/core';

// Ionic
import { Storage } from '@ionic/storage';

// Firebase
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
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
    ingredients.forEach((food : Food | Recipe) => {
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
            this._fitPvd.getFitness$(authId).toPromise().then((fitness: Fitness) => {
              this._storage.set(`userRequirements-${CURRENT_DAY}`, fitness.requirements).then(() => {
                this._userRequirements = fitness.requirements;
                for (let nutrientKey in mealPlan.nutrition) {
                  nutrition[nutrientKey].value = Math.round((mealPlan.nutrition[nutrientKey].value * 100) / (fitness.requirements[nutrientKey].value || 1));
                }
                resolve(nutrition);
              }).catch((err: Error) => reject(err));
            }).catch((err: firebase.FirebaseError) => reject(err));
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

      if (meal.combos.feeling === 'Energized') {
        lifePoints += 15;
      } else {
        lifePoints -= 15;
      }

      if (meal.combos.slowEating) {
        lifePoints += 5;
      } else {
        lifePoints -= 5;
      }

      if (meal.quantity < 700) {
        lifePoints += 15;
      } else {
        lifePoints -= 15;
      }
    });

    if (mealPlan.nutrition.protein.value === this._userRequirements.protein.value) {
      lifePoints += 10;
    } else {
      lifePoints -= 10;
    }

    if (mealPlan.nutrition.carbs.value === this._userRequirements.carbs.value) {
      lifePoints += 10;
    } else {
      lifePoints -= 10;
    }

    if (mealPlan.nutrition.fats.value === this._userRequirements.fats.value) {
      lifePoints += 10;
    } else {
      lifePoints -= 10;
    }

    if (mealPlan.nutrition.fiber.value >= this._userRequirements.fiber.value) {
      lifePoints += 10;
    } else {
      lifePoints -= 10;
    }

    if (mealPlan.nutrition.sugars.value <= this._userRequirements.sugars.value) {
      lifePoints += 15;
    } else {
      lifePoints -= 15;
    }

    if (mealPlan.nutrition.transFat.value <= this._userRequirements.transFat.value) {
      lifePoints += 15;
    } else {
      lifePoints -= 15;
    }

    if (mealPlan.nutrition.sodium.value <= this._userRequirements.sodium.value) {
      lifePoints += 10;
    } else {
      lifePoints -= 10;
    }

    if (mealPlan.nutrition.alcohol.value <= this._userRequirements.alcohol.value) {
      lifePoints += 10;
    } else {
      lifePoints -= 10;
    }

    if (mealPlan.nutrition.caffeine.value <= this._userRequirements.caffeine.value) {
      lifePoints += 5;
    } else {
      lifePoints -= 5;
    }

    return lifePoints;
  }

  public checkFoodIntolerance(mealPlan: MealPlan): void {
    mealPlan.meals.forEach((meal: Meal) => {
      if (meal.combos.calmEating && meal.combos.slowEating && meal.quantity < 700 && meal.combos.feeling !== 'Energized') {
        meal.foods.forEach((food: Food | Recipe) => {
          if (food.hasOwnProperty('chef')) {
            this._getRecipeFoods([], (<Recipe>food).ingredients);
            mealPlan.intoleranceList = [...mealPlan.intoleranceList , ...this._getRecipeFoods([], (<Recipe>food).ingredients)];
          } else {
            mealPlan.intoleranceList = [...mealPlan.intoleranceList , <Food>food];
          }
        });
      }
    })
  }

  public getMealPlan$(authId: string): FirebaseObjectObservable<MealPlan> {
    return this._db.object(`/meal-plan/${authId}/${CURRENT_DAY}`);
  }

  public saveMealPlan(authId: string, mealPlan: MealPlan): firebase.Promise<void> {
    this._storage.ready().then(() => {
      this._storage.set(`nutritionLifePoints-${CURRENT_DAY}`, mealPlan.lifePoints)
        .catch((err: Error) => console.error(`Error storing nutrition lifepoints: ${err.toString()}`));
    }).catch((err: Error) => console.error(`Error loading storage: ${err.toString()}`));
    if (!!mealPlan.weekPlan && !!mealPlan.weekPlan.length) {
      if (mealPlan.date !== mealPlan.weekPlan[0].date) {
        mealPlan.weekPlan = [mealPlan, ...mealPlan.weekPlan.slice(0, 6)];
      } else {
        mealPlan.weekPlan[0] = Object.assign({}, mealPlan);
      }
    } else {
      mealPlan.weekPlan = [mealPlan];
    }
    return this._db.object(`/meal-plan/${authId}/${CURRENT_DAY}`).set(mealPlan);
  }

  public sortMeals(meals: Meal[]): Meal[] {
    return sortBy(meals, (meal: Meal) => meal.hour);
  }
}
