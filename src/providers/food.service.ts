// App
import { Injectable } from '@angular/core';

// Models
import { Food } from '../models';

/**
 * TODO: Make XHTTP Request via Nodejs for each nutrient and calculate the average of 
 */

const NUTRIENT_MEANS: { 
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
  'fat': 30,
  'fiber': 10,
  'lactose': 3,
  'protein': 20,
  'sodium': 0.1,
  'starch': 3,
  'sugars': 10,
  'vitaminC': 0.04,
  'water': 50
};

@Injectable()
export class FoodService {
  constructor() { }

  private _checkAstrigent(food: Food, cooked: boolean): boolean {
    /**
     * Tannins
     * Water absorbant
     * Low fat
     */
    return food.nutrition.fats.value <= NUTRIENT_MEANS.fat;
  }

  private _checkBitter(food: Food): boolean {
    /**
     * Alkalies
     * High fiber foods
     */
    return food.nutrition.fiber.value >= NUTRIENT_MEANS.fiber;
  }

  private _checkPungent(food: Food): boolean {
    /**
     * Acids
     * Spicy foods
     * High vitamin C herbs, spices, and vegetables
     */
    return (food.group === 'Spices and Herbs' || food.group === 'Vegetables') && food.nutrition.vitaminC.value >= NUTRIENT_MEANS.vitaminC;
  }

  private _checkSalty(food: Food): boolean {
    /**
     * Fish, seafood, and high sodium foods
     */
    return food.nutrition.sodium.value >= NUTRIENT_MEANS.sodium || food.group === 'Finfish and Shellfish Products';
  }

  private _checkSour(food: Food, cooked: boolean): boolean {
    /**
     * Citrus and fermented foods
     */
    return (food.group === 'Fruits and Fruit Juices' && food.nutrition.sugars.value <= NUTRIENT_MEANS.sugars) || food.nutrition.alcohol.value >= 0 || food.name.toLocaleLowerCase().includes('vinegar') || (food.group === 'Dairy and Egg Products' && food.nutrition.lactose.value < NUTRIENT_MEANS.lactose);
  }

  public checkFood(dosha: string, food: Food): boolean {
    /**
     * Vata must avoid raw, dry, dehydrated, frozen, cold, uncooked foods, with caffeine, and alcohol
     */

    return true;
  }

  public classifyFood(food: Food, cooked: boolean): void {
    if (this._checkAstrigent(food, cooked)) {
      food.type = 'astrigent';
    } else if (this._checkSalty(food)) {
      food.type = 'salty'
    } else if (this._checkPungent(food)) {
      food.type = 'pungent';
    } else if (this._checkSour(food, cooked)) {
      food.type = 'sour';
    } else if (this._checkBitter(food)) {
      food.type = 'bitter';
    } else {
      food.type = 'sweet';
    }
  }

  public getPRAL(food: Food): number {
    /**
     * PRAL formula by Dr. Thomas Remer
     * Determines the pH of food
     * If PRAL above 0, the food is acid forming
     * If PRAL below 0, the food is alkaline forming
     */
    return 0.49 * food.nutrition.protein.value + 0.037 * food.nutrition.phosphorus.value - 0.021 * food.nutrition.potassium.value - 0.026 * food.nutrition.magnesium.value - 0.013 * food.nutrition.calcium.value;
  }
}
