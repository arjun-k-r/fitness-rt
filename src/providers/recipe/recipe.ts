// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Firebase
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
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

  public calculateRecipeDRI(authId: string, recipe: Recipe): Promise<Nutrition> {
    return new Promise((resolve, reject) => {
      const nutrition: Nutrition = new Nutrition();
      const subscription: Subscription = this._nutritionPvd.getDri$(authId).subscribe((dri: Nutrition) => {
        dri = dri['$value'] === null ? new Nutrition() : dri;
        for (let nutrientKey in recipe.nutrition) {
          nutrition[nutrientKey].value = Math.round((recipe.nutrition[nutrientKey].value * 100) / (dri[nutrientKey].value || 1));
        }
        subscription.unsubscribe();
        resolve(nutrition);
      }, (err: firebase.FirebaseError) => reject(err.message));
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

  public removeRecipe(authId: string, recipe: Recipe): firebase.Promise<void> {
    return this._db.list(`/recipes/${authId}`).remove(recipe['$key']);
  }

  public saveRecipe(authId: string, recipe: Recipe): firebase.Promise<void> {
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
