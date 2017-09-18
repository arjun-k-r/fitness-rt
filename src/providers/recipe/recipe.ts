// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import { Storage } from '@ionic/storage';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import {
  Fitness,
  Food,
  Nutrition,
  Recipe
} from '../../models';

// Providers
import { FitnessProvider } from '../fitness/fitness';

@Injectable()
export class RecipeProvider {
  constructor(
    private _afAuth: AngularFireAuth,
    private _db: AngularFireDatabase,
    private _fitPvd: FitnessProvider,
    private _storage: Storage
  ) { }

  public calculateRecipeDRI(authId: string, recipe: Recipe): Promise<Nutrition> {
    return new Promise((resolve, reject) => {
      const nutrition: Nutrition = new Nutrition();
      const currentDay: number = moment().dayOfYear();
      this._storage.ready().then(() => {
        this._storage.get(`userRequirements-${currentDay}`).then((dri: Nutrition) => {
          if (!!dri) {
            for (let nutrientKey in recipe.nutrition) {
              nutrition[nutrientKey].value = Math.round((recipe.nutrition[nutrientKey].value * 100) / (dri[nutrientKey].value || 1));
              resolve(nutrition);
            }
          } else {
            const subscription: Subscription = this._fitPvd.getFitness$(authId).subscribe((fitness: Fitness) => {
              this._storage.set(`userRequirements-${currentDay}`, fitness.requirements).then(() => {
                for (let nutrientKey in recipe.nutrition) {
                  nutrition[nutrientKey].value = Math.round((recipe.nutrition[nutrientKey].value * 100) / (fitness.requirements[nutrientKey].value || 1));
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
    if (recipe.hasOwnProperty('$key')) {
      return this._db.list(`/recipes/${authId}`).update(recipe['$key'], recipe);
    } else {
      recipe.chef = authId;
      return this._db.list(`/recipes/${authId}`).push(recipe);
    }
  }

}
