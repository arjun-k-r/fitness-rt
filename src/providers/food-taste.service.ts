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
   * @description A food is astrigent if it is raw and contains tannins and if it is high in fiber, and low in fat (absorbs water)
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is astrigent
   */
  private _checkAstrigent(food: Food): boolean {
    let isDry: boolean = food.name.toLocaleLowerCase().includes('dried') || food.name.toLocaleLowerCase().includes('dry') || food.name.toLocaleLowerCase().includes('dehydrated'),
      isHighFiber: boolean = food.nutrition.fiber.value > NUTRIENT_THRESHOLDS.fiber,
      isLowFat: boolean = food.nutrition.fats.value < NUTRIENT_THRESHOLDS.fat,
      isNotCooked: boolean = food.name.toLocaleLowerCase().includes('raw') && !(food.name.toLocaleLowerCase().includes('cooked') || food.name.toLocaleLowerCase().includes('stewed')),
      isPlant: boolean = food.group === 'Fruits and Fruit Juices' || food.group === 'Legumes and Legume Products' || food.group === 'Spices and Herbs' || food.group === 'Vegetables and Vegetable Products';

    return (isPlant && isHighFiber && isLowFat) || isDry || isNotCooked;
  }

  /**
   * Verifies if food has bitter taste
   * @description A food is bitter if it is a leafy green (high in vitamin K), herb, or spice
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is bitter
   */
  private _checkBitter(food: Food): boolean {
    return (food.group === 'Spices and Herbs' || food.group === 'Vegetables and Vegetable Products') && food.nutrition.vitaminK.value >= NUTRIENT_THRESHOLDS.vitaminK;
  }

  /**
   * Verifies if food has pungent taste
   * @description A food is pungent if it contains sulfur or capsacin (hot and spicy)
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is pungent
   */
  private _checkPungent(food: Food): boolean {
    let isSpicyVegetable: boolean = food.name.toLocaleLowerCase().includes('cayenne') || food.name.toLocaleLowerCase().includes('hot') || food.name.toLocaleLowerCase().includes('chilli') || food.name.toLocaleLowerCase().includes('garlic') || food.name.toLocaleLowerCase().includes('onion') || food.name.toLocaleLowerCase().includes('radish') || food.name.toLocaleLowerCase().includes('mustard') || food.name.toLocaleLowerCase().includes('turnip');

    return food.group === 'Spices and Herbs' || isSpicyVegetable;
  }

  /**
   * Verifies if food has salty taste
   * @description A food is salty if it has high sodium content, typically a seafood
   * @param {Food} food The food to clasify
   * @returns {boolean} Returns true if the food is salty
   */
  private _checkSalty(food: Food): boolean {
    return food.nutrition.sodium.value >= NUTRIENT_THRESHOLDS.sodium || food.group === 'Finfish and Shellfish Products';
  }

  /**
   * Clasifies the food by its taste
   * @param {Food} food The food to clasify
   * @returns {void}
   */
  public classifyByTaste(food: Food): void {
    if (this._checkSalty(food)) {
      food.tastes.push('Salty')
    } else if (this._foodTypeSvc.checkAcid(food)) {
      food.tastes.push('Sour')
    } else if (this._checkBitter(food)) {
      food.tastes.push('Bitter');
    } else {
      food.tastes.push('Sweet')
    }

    if (this._checkPungent(food)) {
      food.tastes.push('Pungent')
    }

    if (this._checkAstrigent(food)) {
      food.tastes.push('Astrigent');
    }
  }

}
