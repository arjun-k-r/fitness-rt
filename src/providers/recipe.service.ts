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
   * Gets the recipe difficulty level by the number of instructions
   * @param {Recipe} recipe - The recipe to check
   * @returns {string} Returns the difficulty level name
   */
  public checkDifficulty(recipe: Recipe): string {
    return recipe.instructions.length < 5 ? 'Piece of cake' : recipe.instructions.length < 10 ? 'Warth a try' : 'Master chef';
  }

  /**
   * Gets a description of a cooking method
   * @param {string} cookingMethod - The cooking method the description is required for
   * @returns {string} Returns the cooking method's description
   */
  public getCookMethodInfo(cookingMethod: string): string {
    switch (cookingMethod) {
      case 'Baking':
        return 'In baking method of cooking, the food is cooked using convection heating. The food is put into an enclosed area where heat is then applied and the movement of heat within the confined space, acts on the food that make it get cooked.'

      case 'Barbequing':
        return 'The method of cooking food by barbequing is usually associated with fund raising activities, parties or picnics. It is most suitable to cooking meat cutlets, fish or chicken pieces. The food is usually marinated with spices and tenderizers (for meat cuts) for sometime before it is cooked. With this method of cooking, a sheet of metal with stands is heated up and oil is used to cook the food. A sufficient amount of oil is heated up and food is added. The food is then turned over a couple of times before it is dished out.'

      case 'Boiling':
        return 'This is the most common method of cooking and is also the simplest. With this method of cooking, enough water is added to food and it is then cooked over the fire. The action of the heated water makes the food to get cooked. The liquid is usually thrown away after the food is cooked. In the case of cooking rice, all the water is absorbed by the rice grains to make it get cooked. During the heating process, the nutrients can get lost or destroyed and the flavour can be reduced with this method of cooking. If you over cooked cabbage, all the nutrients can get lost.'

      case 'Frying':
        return 'When food is fried using oil or solid fat it is important that you observe some rules in handling oil or fat. Simple rules to follow when frying: 1.Make sure there is enough oil or fat put in the frying pan or a deep frying pan. 2.The food to be cooked must not have water dripping from it. This is because when water comes into contact with hot oil or fat, you will have the oil sizzling and spitting out of the pan, which could burn your skin if you are not careful. 3.Put the food into the hot oil carefully. Try not to make a big splash as the oil could burn your skin. 4.The oil of fat should be heated to the right temperature before putting food into the pan to be fried. If the food is put in when the oil or fat is not heated to the right temperature, the food will soak up the oil and you will have food that is all oily or greasy. If the oil or fat is over heated, you will end up with food that is burnt. Sometimes the food especially doughnuts will turn brown on the outside but the dough inside is uncooked. To cook food using the frying method, there are two ways of doing it. There is the shallow frying and the deep frying methods.'

      case 'Grilling':
        return 'There are two methods of grilling that are used these days. One type of grilling is the one that is commonly used by the people in the village. This is when food is cooked over hot charcoal on an open fire. The food is placed on top of the burning charcoal. Sometimes people improvise by using wire mesh and place it over the open fire to grill fish or vegetables. The other method is using grills that are inbuilt in stoves. In this method, the griller, which has a tray, is heated up and the food is placed on the grill tray to cook. The heat can be gas-generated or electric-generated depending on the type of stove used. The food is again left to cook on the grill with the doors of the grill open. People who can afford to buy a stove would use the grilling part to grill their food. What happens in this type of cooking is the heat seals the outside part of the food and the juice inside the food cooks it. The flavour of the food is not lost and much of the nutrients are not lost either. Food is frequently turned over to prevent it from burning and to ensure that equal heating and cooking time is applied to both sides of the food. By doing this, the food is cooked evenly and thoroughly.'

      case 'Roasting':
        return 'With roasting, direct heat is applied to the food. The heat seals the outside part of the food and the juice inside the food cooks the food. Roasting is mainly used when cooking fleshy food like fish, meat or chicken. When heat is applied to the outer covering of the food, it seals it up thereby trapping all the juices inside the food. The action of direct heating, heats up the juices inside the food, which then cooks the food. Again there is very little nutrient lost and the flavour is not spoilt. Food is frequently rotated over the spit so that there is even heating applied to all parts of the food. This is so that heat is applied evenly to the food to make it get cooked properly.'

      case 'Steaming':
        return 'To steam food, water is added to a pot and then a stand is placed inside the pot. The water level should be under the stand and not above it. There is no contact between the food and the water that is added to the pot. Food is then placed on the stand and heat is applied. The hot steam rising from the boiling water acts on the food and the food gets cooked. It is the hot steam that cooks the food, as there is no contact between the food and the water inside the pot. This method of cooking for vegetables is very good as the food does not lose its flavour and much of the nutrients are not lost during the cooking.'

      case 'Stewing':
        return 'In the process of cooking using the stewing method, food is cooked using a lot of liquid. Different kinds of vegetables are chopped, diced or cubed and added to the pot. Sometimes pieces of selected meat, fish or chicken is also chopped and added to the stew. The liquid is slightly thickened and stewed food is served in that manner. This method is also used when preparing fruits that are going to be served as desserts. With this cooking method, every food is cooked together at the same time in one pot. The flavour, colours, shapes and textures of the different vegetables that are used, makes stewing a handy method of cooking. The only disadvantage is that some of the vegetables might be overcooked and thus the nutrient content becomes much less. It is therefore important that the vegetables that take the longest to cook to be put into the pot first and the ones that need least cooking to be put in last. In this way much of the nutrient contents of the food does not get lost.'
    
      default:
        return 'Least amount of preparation required. Only rinsing, pealing, or cutting without any heat or chemical processes (eating as it is)';
    }
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
      recipe['$key'] = this._recipes.push(recipe).key;
    } else {
      this._recipes.update(recipe['$key'], {
        chef: recipe.chef,
        cookingMethod: recipe.cookingMethod,
        cookingTemperature: recipe.cookingTemperature,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        name: recipe.name,
        nutrition: recipe.nutrition,
        portions: recipe.portions,
        pral: recipe.pral,
        quantity: recipe.quantity,
        servings: recipe.servings
      });
    }
  }

}
