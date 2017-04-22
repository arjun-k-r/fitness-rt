import { Injectable } from '@angular/core';

// Models
import { Food, NUTRIENT_THRESHOLDS } from '../models';

@Injectable()
export class FoodTypeService {

  constructor() { }

  /**
   * Verifies if food is an acid fruit
   * @description A fruit is an acid if it is low in sugar and high in vitamin C
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is an acid fruit
   */
  private _checkAcidFruit(food: Food): boolean {
    return food.name.toLocaleLowerCase().includes('tomato') || (food.group === 'Fruits and Fruit Juices' && ((food.nutrition.sugars.value < (NUTRIENT_THRESHOLDS.sugars - 1) && food.nutrition.vitaminC.value > NUTRIENT_THRESHOLDS.vitaminC) || food.nutrition.sugars.value === 0));
  }

  /**
   * Verifies if food is a fatty food
   * @description A food is fatty if it has high fat content
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a fatty food
   */
  private _checkFat(food: Food): boolean {
    return food.nutrition.fats.value >= NUTRIENT_THRESHOLDS.fat;
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
   * Verifies if food is milk sweet
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is milk
   */
  private _checkMilk(food: Food): boolean {
    return food.name.toLocaleLowerCase().includes('milk');
  }

  /**
   * Verifies if food is a protein food
   * @description A food is a protein if it has high protein content or if it is an animal product
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a protein food
   */
  private _checkProtein(food: Food): boolean {
    let isAnimalProduct: boolean = food.group === 'Beef Products' || food.group === 'Dairy and Egg Products' || food.group === 'Finfish and Shellfish Products' || food.group === 'Lamb, Veal, and Game Products' || food.group === 'Pork Products' || food.group === 'Poultry Products' || food.group === 'Sausages and Luncheon Meats';

    return food.nutrition.protein.value >= NUTRIENT_THRESHOLDS.protein || isAnimalProduct;
  }

  /**
   * Verifies if food is a starchy food
   * @description A food is starchy if it has hhigh carbohydrate or starch content
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a starchy food
   */
  private _checkStarch(food: Food): boolean {
    return (food.nutrition.starch.value > NUTRIENT_THRESHOLDS.starch) || food.group === 'Legumes and Legume Products' || food.group === 'Cereal Grains and Pasta' || (food.group === 'Vegetables and Vegetable Products' && food.nutrition.carbs.value > NUTRIENT_THRESHOLDS.carbs);
  }

  /**
   * Verifies if food is a sub-acid fruit (medium sugar)
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a sub-acid fruit
   */
  private _checkSubAcidFruit(food: Food): boolean {
    return food.group === 'Fruits and Fruit Juices' && (food.nutrition.sugars.value <= (NUTRIENT_THRESHOLDS.sugars + 1) && food.nutrition.sugars.value >= (NUTRIENT_THRESHOLDS.sugars - 1));
  }

  /**
   * Verifies if food is a sugar
   * @description A food is a sugar or sweet if it has high sugar content
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a sugar
   */
  private _checkSugar(food: Food): boolean {
    return food.group === 'Sweets' || food.nutrition.sugars.value > (NUTRIENT_THRESHOLDS.sugars + 1);
  }

  /**
   * Verifies if food is a sweet fruit
   * @description A fruit is sweet if it has high sugar content
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a sweet fruit
   */
  private _checkSweetFruit(food: Food): boolean {
    return food.group === 'Fruits and Fruit Juices' && food.nutrition.sugars.value > (NUTRIENT_THRESHOLDS.sugars + 1);
  }

  /**
   * Verifies if food is a non-starch
   * @description A food is non-starchy typically if it is a vegetable
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is a non-starch
   */
  private _checkNonStarch(food: Food): boolean {
    return (food.group === 'Vegetables and Vegetable Products' && food.nutrition.carbs.value < NUTRIENT_THRESHOLDS.carbs) || food.group === 'Spices and Herbs';
  }

  /**
   * Verifies if food is an acid (e.g. citrus or fermented)
   * @description A food is an acid if it is a an acid fruit, alcool, or fermented food
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is an acid
   */
  public checkAcid(food: Food): boolean {
    let isFermented: boolean = food.group === 'Dairy and Egg Products' && (food.nutrition.lactose.value < NUTRIENT_THRESHOLDS.lactose || food.name.toLocaleLowerCase().includes('sour'));
    
    return this._checkAcidFruit(food) || food.nutrition.alcohol.value > 0 || food.name.toLocaleLowerCase().includes('vinegar') || isFermented;
  }

  /**
   * Clasifies the food by its nutritional values
   * @param {Food} food The food to clasify
   */
  public classifyByType(food: Food): void {
    if (this._checkNonStarch(food)) {
      food.type = 'Veggie';
    }

    if (this.checkAcid(food)) {
      food.type = 'Acid';
    }

    if (this._checkAcidFruit(food)) {
      food.type = 'Acid fruit';
    }

    if (this._checkFat(food)) {
      food.type = 'Fat';
    }

    if (this._checkFluid(food)) {
      food.type = 'Fluid';
    }

    if (this._checkMelon(food)) {
      food.type = 'Melon';
    }

    if (this._checkMilk(food) && !this.checkAcid(food)) {
      food.type = 'Milk';
    }

    if (this._checkProtein(food)) {
      food.type = 'Protein';
    }

    if (this._checkStarch(food)) {
      food.type = 'Starch';
    }

    if (this._checkSubAcidFruit(food)) {
      food.type = 'Sub-acid fruit';
    }

    if (this._checkSugar(food)) {
      food.type = 'Sugar';
    }

    if (this._checkSweetFruit(food)) {
      food.type = 'Sweet fruit';
    }
  }

}
