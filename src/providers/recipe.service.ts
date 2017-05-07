// App
import { Injectable } from '@angular/core';
import { User } from '@ionic/cloud-angular';

// Third-party
import { AngularFire, FirebaseListObservable } from 'angularfire2';

// Models
import {
  Food,
  Nutrition,
  Recipe,
  WarningMessage
} from '../models';

// Providers
import { FoodDataService } from './food-data.service';
import { FoodService } from './food.service';
import { NutritionService } from './nutrition.service';

@Injectable()
export class RecipeService {
  private _recipes: FirebaseListObservable<Array<Recipe>>;
  constructor(
    private _af: AngularFire,
    private _foodSvc: FoodService,
    private _foodDataSvc: FoodDataService,
    private _nutritionSvc: NutritionService,
    private _user: User
  ) {
    this._recipes = _af.database.list(`/recipes/${_user.id}`, {
      query: {
        orderByChild: 'name'
      }
    });
  }

  /**
   * Gets the alkalinity of a recipe, based on the impact of each ingredient quantity and pral value
   * @param {Array} items - The ingredients of the recipe
   * @returns {number} Returns the pral of the recipe
   */
  public getRecipePral(items: Array<Food>): number {
    return this._nutritionSvc.calculatePral(items);
  }

  /**
   * Gets the size of the recipe
   * @param {Array} items - The ingredients of the recipe
   * @returns {number} Returns the quantity in grams of the recipe
   */
  public getRecipeSize(items: Array<Food>): number {
    return this._nutritionSvc.calculateQuantity(items);
  }

  /**
   * Removes the recipe from the database
   * @param {Recipes} recipe - The recipe to update
   * @returns {void}
   */
  public removeRecipe(recipe: Recipe): void {
    this._recipes.remove(recipe['$key']);
  }

  /**
   * Updates a recipe to the database or adds it if it's new
   * @param {Recipes} recipe - The recipe to update
   * @returns {void}
   */
  public saveRecipe(recipe: Recipe): void {
    if (!recipe.hasOwnProperty('$key')) {
      this._recipes.push(recipe);
    } else {
      this._recipes.update(recipe['$key'], {
        chef: recipe.chef,
        ingredients: recipe.ingredients,
        name: recipe.name,
        nutrition: recipe.nutrition,
        portions: recipe.portions,
        pral: recipe.pral,
        quantity: recipe.quantity,
        servings: recipe.servings,
        tastes: recipe.tastes
      });
    }
  }

}
