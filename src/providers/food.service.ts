// App
import { Injectable } from '@angular/core';

// Models
import { Food } from '../models';

const NUTRIENT_MEANS: {
  carbs: number,
  fat: number,
  fiber: number,
  lactose: number,
  protein: number,
  sodium: number,
  starch: number,
  sugars: number,
  vitaminC: number,
  water: number
} = {
    'carbs': 10,
    'fat': 10,
    'fiber': 10,
    'lactose': 3,
    'protein': 20,
    'sodium': 0.1,
    'starch': 3,
    'sugars': 11,
    'vitaminC': 0.04,
    'water': 50
  };

@Injectable()
export class FoodService {
  constructor() { }

  /**
   * Verifies if food is an acid fruit (low sugar)
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is an acid fruit
   */
  private _checkAcidFruit(food: Food): boolean {
    return food.name.toLocaleLowerCase().includes('tomato') || (food.group === 'Fruits and Fruit Juices' && food.nutrition.sugars.value < NUTRIENT_MEANS.sugars - 1);
  }

  /**
   * Verifies if food has astrigent taste (e.g. tannins, absorbs water, or low fat)
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is astrigent
   */
  private _checkAstrigent(food: Food): boolean {
    return (food.group === 'Fruits and Fruit Juices' || food.group === 'Legumes and Legume Products' || food.group === 'Spices and Herbs' || food.group === 'Vegetables and Vegetable Products') && food.nutrition.fats.value < NUTRIENT_MEANS.fat;
  }

  /**
   * Verifies if food has bitter taste (e.g. alkalies or high fiber)
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is bitter
   */
  private _checkBitter(food: Food): boolean {
    return (food.group === 'Spices and Herbs' || food.group === 'Vegetables and Vegetable Products') && food.nutrition.fiber.value >= NUTRIENT_MEANS.fiber;
  }

  /**
   * Verifies if food is a fatty food (high fat)
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a fatty food
   */
  private _checkFat(food: Food): boolean {
    return food.nutrition.fats.value >= NUTRIENT_MEANS.fat;
  }

  /**
   * Verifies if food is a fluid
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a fluid
   */
  private _checkFluid(food: Food): boolean {
    return food.group === 'Beverages';
  }

  /**
   * Verifies if food is a melon
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a melon
   */
  private _checkMelon(food: Food): boolean {
    return food.name.toLocaleLowerCase().includes('melon');
  }

  /**
   * Verifies if food is milk
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is milk
   */
  private _checkMilk(food: Food): boolean {
    return food.name.toLocaleLowerCase().includes('milk');
  }

  /**
   * Verifies if food is a protein food (high protein or animal product)
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a protein food
   */
  private _checkProtein(food: Food): boolean {
    return food.nutrition.protein.value >= NUTRIENT_MEANS.protein || food.group === 'Beef Products' || food.group === 'Dairy and Egg Products' || food.group === 'Finfish and Shellfish Products' || food.group === 'Lamb, Veal, and Game Products' || food.group === 'Pork Products' || food.group === 'Poultry Products' || food.group === 'Sausages and Luncheon Meats';
  }

  /**
   * Verifies if food has pungent taste (e.g. acids, spicy, or high vitamin C herbs, spices, and leafy greens)
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is pungent
   */
  private _checkPungent(food: Food): boolean {
    return (food.group === 'Spices and Herbs' || food.group === 'Vegetables and Vegetable Products') && food.nutrition.vitaminC.value >= NUTRIENT_MEANS.vitaminC;
  }

  /**
   * Verifies if food has salty taste (e.g. fish, seafood, or high sodium)
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is salty
   */
  private _checkSalty(food: Food): boolean {
    return food.nutrition.sodium.value >= NUTRIENT_MEANS.sodium || food.group === 'Finfish and Shellfish Products';
  }

  /**
   * Verifies if food has sour taste (e.g. citrus or fermented)
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is sour
   */
  private _checkSour(food: Food): boolean {
    return this._checkAcidFruit(food) || food.nutrition.alcohol.value >= 0 || food.name.toLocaleLowerCase().includes('vinegar') || (food.group === 'Dairy and Egg Products' && food.nutrition.lactose.value < NUTRIENT_MEANS.lactose);
  }

  /**
   * Verifies if food is a starchy food (high starch)
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a starchy food
   */
  private _checkStarch(food: Food): boolean {
    if (food.nutrition.hasOwnProperty('starch')) {
      return food.nutrition.starch.value > NUTRIENT_MEANS.starch;
    } else {
      return food.group === 'Legumes and Legume Products' || food.group === 'Cereal Grains and Pasta' || (food.group === 'Vegetables and Vegetable Products' && food.nutrition.carbs.value > NUTRIENT_MEANS.carbs);
    }
  }

  /**
   * Verifies if food is a sub-acid fruit (medium sugar)
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a sub-acid fruit
   */
  private _checkSubAcidFruit(food: Food): boolean {
    return food.group === 'Fruits and Fruit Juices' && (food.nutrition.sugars.value <= NUTRIENT_MEANS.sugars + 1 || food.nutrition.sugars.value >= NUTRIENT_MEANS.sugars - 1);
  }

  /**
   * Verifies if food is a sugar
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a sugar
   */
  private _checkSugar(food: Food): boolean {
    return food.group === 'Sweets' || food.nutrition.sugars.value > NUTRIENT_MEANS.sugars + 1;
  }

  /**
   * Verifies if food is a sweet fruit (high sugar)
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a sweet fruit
   */
  private _checkSweetFruit(food: Food): boolean {
    return food.group === 'Fruits and Fruit Juices' && food.nutrition.sugars.value > NUTRIENT_MEANS.sugars + 1;
  }

  /**
   * Verifies if food is a non-starch
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a non-starch
   */
  private _checkNonStarch(food: Food): boolean {
    return (food.group === 'Vegetables and Vegetable Products' && food.nutrition.carbs.value < NUTRIENT_MEANS.carbs) || food.group === 'Spices and Herbs';
  }

  /**
   * Clasifies the food by its taste
   * @param {Food} food The food to clasify
   */
  public classifyFoodTaste(food: Food): void {
    if (this._checkAstrigent(food)) {
      food.taste = 'astrigent';
    } else if (this._checkSalty(food)) {
      food.taste = 'salty'
    } else if (this._checkPungent(food)) {
      food.taste = 'pungent';
    } else if (this._checkSour(food)) {
      food.taste = 'sour';
    } else if (this._checkBitter(food)) {
      food.taste = 'bitter';
    } else {
      food.taste = 'sweet';
    }
  }

  /**
   * Clasifies the food by its nutritional values
   * @param {Food} food The food to clasify
   */
  public clasifyFoodType(food: Food): void {
    if (this._checkSour(food)) {
      food.type = 'acid';
    } else if (this._checkAcidFruit(food)) {
      food.type = 'acid fruit';
    } else if (this._checkFat(food)) {
      food.type = 'fat';
    } else if (this._checkFluid(food)) {
      food.type = 'fluid';
    } else if (this._checkMelon(food)) {
      food.type = 'melon';
    } else if (this._checkMilk(food)) {
      food.type = 'milk';
    } else if (this._checkProtein(food)) {
      food.type = 'protein';
    } else if (this._checkStarch(food)) {
      food.type = 'starch';
    } else if (this._checkSubAcidFruit(food)) {
      food.type = 'sub-acid fruit';
    } else if (this._checkSugar(food)) {
      food.type = 'sugar';
    } else if (this._checkSweetFruit(food)) {
      food.type = 'sweet fruit';
    } else {
      food.type = 'veggie';
    }
  }

  /**
   * The PRAL formula designed by Dr. Thomas Remer
   * Determines the food impact on the body's pH levels
   * @param {Food} food The food to check
   * @returns Returns the PRAL value of the food (above 0 is acidic and below 0 is alkaline forming)
   */
  public getPRAL(food: Food): number {
    return 0.49 * food.nutrition.protein.value + 0.037 * food.nutrition.phosphorus.value - 0.021 * food.nutrition.potassium.value - 0.026 * food.nutrition.magnesium.value - 0.013 * food.nutrition.calcium.value;
  }
}
