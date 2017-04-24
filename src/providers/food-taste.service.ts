import { Injectable } from '@angular/core';

// Models
import { Food, NUTRIENT_THRESHOLDS } from '../models';

// Providers
import { FoodTypeService } from './food-type.service';

@Injectable()
export class FoodTasteService {

  constructor(private _foodTypeSvc: FoodTypeService) { }

  /**
   * Verifies if food has astrigent taste
   * @description A food is astrigent if it's high in tannins'. Typically, tannins are high in potassium
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is astrigent
   */
  private _checkAstrigent(food: Food): boolean {
    return food.nutrition.potassium.value >= NUTRIENT_THRESHOLDS.potassium;
  }

  /**
   * Verifies if food has bitter taste
   * @description A food is bitter if it is an alkaloid or glycoside. Typically, leafy greens, which are high in vitamin K
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is bitter
   */
  private _checkBitter(food: Food): boolean {
    return food.nutrition.vitaminK.value >= NUTRIENT_THRESHOLDS.vitaminK;
  }

  /**
   * Verifies if food has pungent taste
   * @description A food is pungent if it's high in sulfur or capsaicin'
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is pungent
   */
  private _checkPungent(food: Food): boolean {
    let isSpicyVegetable: boolean = food.name.toLocaleLowerCase().includes('cayenne') || food.name.toLocaleLowerCase().includes('hot') || food.name.toLocaleLowerCase().includes('chilli') || food.name.toLocaleLowerCase().includes('garlic') || food.name.toLocaleLowerCase().includes('onion') || food.name.toLocaleLowerCase().includes('radish') || food.name.toLocaleLowerCase().includes('mustard') || food.name.toLocaleLowerCase().includes('turnip');

    return food.group === 'Spices and Herbs' || isSpicyVegetable;
  }

  /**
   * Verifies if food has salty taste
   * @description A food is salty if it's high in sodium'
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is salty
   */
  private _checkSalty(food: Food): boolean {
    return food.nutrition.sodium.value >= NUTRIENT_THRESHOLDS.sodium;
  }

  /**
   * Verifies if food has sweet taste
   * @description A food is sweet if it's high in carbohydrates
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is sweet
   */
  private _checkSweet(food: Food): boolean {
    return food.nutrition.carbs.value >= NUTRIENT_THRESHOLDS.carbs;
  }

  /**
   * Clasifies the food by its taste
   * @param {Food} food The food to clasify
   * @returns {void}
   */
  public classifyByTaste(food: Food): void {
    // Sweet (cool, heavy, unctuous) is opposite to Pungent (hot, light, dry)
    if (this._checkSweet(food)) {
      food.tastes.push('Sweet');
    } else if (this._checkPungent(food)) {
      food.tastes.push('Pungent');
    }

    // Sour (hot, light, unctuous) is opposite to Astrigent (cool, heavy, dry)
    if (this._foodTypeSvc.checkAcid(food)) {
      food.tastes.push('Sour');
    } else if (this._checkAstrigent(food)) {
      food.tastes.push('Astrigent');
    }

    // Salty (hot, heavy, unctuous) is opposite to Bitter (cool, light, dry)
    if (this._checkSalty(food)) {
      food.tastes.push('Salty');
    } else if (this._checkBitter(food)) {
      food.tastes.push('Bitter');
    }
  }

}
