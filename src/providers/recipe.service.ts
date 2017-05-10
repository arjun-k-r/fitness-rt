// App
import { Injectable } from '@angular/core';
import { User } from '@ionic/cloud-angular';

// Third-party
import { AngularFire, FirebaseListObservable } from 'angularfire2';

// Models
import {
  Food,
  IFoodSearchResult,
  Nutrition,
  Recipe,
  WarningMessage
} from '../models';

// Providers
import { FoodService } from './food.service';
import { NutritionService } from './nutrition.service';

@Injectable()
export class RecipeService {
  private _recipes: FirebaseListObservable<Array<Recipe>>;
  constructor(
    private _af: AngularFire,
    private _foodSvc: FoodService,
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
   * Calculates the nutritional values of a single portions of the recipe based on the ingredients
   * @param {Array} items - The ingredients of the recipe
   * @param {number} portions - The number of portions for t
   * @returns {Nutrition} Returns the recipe nutrition
   */
  public getRecipeNutrition(items: Array<Food | Recipe>, portions: number): Nutrition {
    let totalNutrition: Nutrition = this._nutritionSvc.getTotalNutrition(items),
      portionNutrition: Nutrition = new Nutrition();

    for (let nutrientKey in totalNutrition) {
      portionNutrition[nutrientKey].value = totalNutrition[nutrientKey].value / portions;
      portionNutrition[nutrientKey].value = +(portionNutrition[nutrientKey].value).toFixed(2);
    }
    return portionNutrition;
  }

  /**
   * Gets the alkalinity of a recipe, based on its nutritional values
   * @param {Nutrition} nutrition - The nutrition of the recipe
   * @returns {number} Returns the pral of the recipe
   */
  public getRecipePral(nutrition: Nutrition): number {
    return this._nutritionSvc.getPRAL(nutrition);
  }

  /**
   * Gets the user's recipes
   * @returns {FirebaseListObservable} Returns an observable that publishes the recipes
   */
  public getRecipes$(): FirebaseListObservable<Array<Recipe>> {
    return this._recipes;
  }

  /**
   * Gets the size of the recipe
   * @param {Array} items - The ingredients of the recipe
   * @returns {number} Returns the quantity in grams of the recipe
   */
  public getRecipeSize(items: Array<Food | Recipe>, portions: number): number {
    return Math.round(this._nutritionSvc.calculateQuantity(items) / portions);
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
    console.log('Saving recipe: ', recipe);
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
        servings: recipe.servings
        //tastes: recipe.tastes
      });
    }
  }

  /**
   * Gets the nutritional values of each ingredient
   * @param {Array} items The selected ingredient
   * @returns {Observable} Returns a stream of food reports
   */
  public serializeIngredientss(items: Array<IFoodSearchResult>): Promise<Array<Food | Recipe>> {
    return this._foodSvc.serializeItems(items);
  }

}
