// Angular
import { Injectable } from '@angular/core';

// Firebase
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';

// Models
import {
  Food,
  Nutrition,
  Recipe
} from '../../models';

// Providers
import { NutritionProvider } from '../nutrition/nutrition';

@Injectable()
export class RecipeProvider {
  constructor(
    private _db: AngularFireDatabase,
    private _nutritionPvd: NutritionProvider
  ) { }

  public calculateRecipeRequirements(authId: string, recipe: Recipe): Promise<Nutrition> {
    return new Promise((resolve, reject) => {
      const nutrition: Nutrition = new Nutrition();
      this._nutritionPvd.getRequirements(authId).then((dailyRequirements: Nutrition) => {
        dailyRequirements = dailyRequirements['$value'] === null ? new Nutrition() : dailyRequirements;
        for (let nutrientKey in recipe.nutrition) {
          nutrition[nutrientKey].value = Math.round((recipe.nutrition[nutrientKey].value * 100) / (dailyRequirements[nutrientKey].value || 1));
        }
        resolve(nutrition);
      }).catch((err: firebase.FirebaseError) => reject(err.message));
    });
  }

  public calculateRecipeNutrition(recipe: Recipe): Nutrition {
    const nutrition = new Nutrition();
    recipe.ingredients.forEach((ingredient: Food | Recipe) => {
      for (let nutrientKey in nutrition) {
        nutrition[nutrientKey].value += (ingredient.nutrition[nutrientKey].value * ingredient.servings);
      }
    });

    for (let nutrientKey in nutrition) {
      nutrition[nutrientKey].value = nutrition[nutrientKey].value / recipe.portions;
    }

    return nutrition;
  }

  public calculateRecipeQuantity(recipe: Recipe): number {
    return Math.round(recipe.ingredients.reduce((quantity: number, ingredient: Food) => quantity + (ingredient.quantity * ingredient.servings), 0) / recipe.portions);
  }

  public getRecipes$(authId: string): FirebaseListObservable<Recipe[]> {
    return this._db.list(`/recipes/${authId}`);
  }

  public removeRecipe(authId: string, recipe: Recipe): Promise<void> {
    return this._db.list(`/recipes/${authId}`).remove(recipe['$key']);
  }

  public saveRecipe(authId: string, recipe: Recipe): any {
    if (recipe.ingredients && recipe.ingredients.length) {
      if (recipe.hasOwnProperty('$key')) {
        return this._db.list(`/recipes/${authId}`).update(recipe['$key'], recipe);
      } else {
        recipe.chef = authId;
        return this._db.list(`/recipes/${authId}`).push(recipe);
      }
    }
  }

}
