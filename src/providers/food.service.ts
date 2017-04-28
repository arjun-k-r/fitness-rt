// App
import { Injectable } from '@angular/core';

// Models
import { Food, IFoodReportNutrient } from '../models';

// Providers
import { FoodTypeService } from './food-type.service';
import { FoodTasteService } from './food-taste.service';

@Injectable()
export class FoodService {
  constructor(private _foodTypeSvc: FoodTypeService, private _tasteSvc: FoodTasteService) { }

  /**
   * Classifies the food by tastes and nutritional values
   * @description Each food has specific tastes (sweet, sour, bitter, salty, punger, astrigent) and
   * has dominant nutrients (protein, starch, sugar, etc.)
   * @param {Food} food - The food to classify
   * @returns {void}
   */
  public classifyFood(food: Food): void {
    this._foodTypeSvc.classifyByType(food);

    // TODO: Is uncertain
    this._tasteSvc.classifyByTaste(food);
  }

  /**
   * Sets the nutritional value of the food to a specific formats
   * @description When the food report is fetched from the USDA Databse it has a very complex value and needs to be mapped to a simpler format
   * @param {Array} nutrients - The list of nutrients
   * @param {Food} food - The food to add the nutritional values to
   * @returns {void}
   */
  public setNutrientValue(nutrients: Array<IFoodReportNutrient>, food: Food): void {
    nutrients.forEach((nutrient: IFoodReportNutrient) => {
      switch (nutrient.nutrient_id.toString()) {
        case '255':
          food.nutrition.water.value = +nutrient.value;
          break;

        case '208':
          food.nutrition.energy.value = +nutrient.value;
          break;

        case '203':
          food.nutrition.protein.value = +nutrient.value;
          break;

        case '204':
          food.nutrition.fats.value = +nutrient.value;
          break;

        case '205':
          food.nutrition.carbs.value = +nutrient.value;
          break;

        case '209':
          food.nutrition.starch.value = +nutrient.value;
          break;

        case '213':
          food.nutrition.lactose.value = +nutrient.value;
          break;

        case '291':
          food.nutrition.fiber.value = +nutrient.value;
          break;

        case '269':
          food.nutrition.sugars.value = +nutrient.value;
          break;

        case '301':
          food.nutrition.calcium.value = +nutrient.value;
          break;

        case '303':
          food.nutrition.iron.value = +nutrient.value;
          break;

        case '304':
          food.nutrition.magnesium.value = +nutrient.value;
          break;

        case '305':
          food.nutrition.phosphorus.value = +nutrient.value;
          break;

        case '306':
          food.nutrition.potassium.value = +nutrient.value;
          break;

        case '307':
          food.nutrition.sodium.value = +nutrient.value;
          break;

        case '309':
          food.nutrition.zinc.value = +nutrient.value;
          break;

        case '312':
          food.nutrition.copper.value = +nutrient.value;
          break;

        case '315':
          food.nutrition.manganese.value = +nutrient.value;
          break;

        case '317':
          food.nutrition.selenium.value = +nutrient.value;
          break;

        case '401':
          food.nutrition.vitaminC.value = +nutrient.value;
          break;

        case '404':
          food.nutrition.vitaminB1.value = +nutrient.value;
          break;

        case '405':
          food.nutrition.vitaminB2.value = +nutrient.value;
          break;

        case '406':
          food.nutrition.vitaminB3.value = +nutrient.value;
          break;

        case '410':
          food.nutrition.vitaminB5.value = +nutrient.value;
          break;

        case '415':
          food.nutrition.vitaminB5.value = +nutrient.value;
          break;

        case '417':
          food.nutrition.vitaminB9.value = +nutrient.value;
          break;

        case '421':
          food.nutrition.choline.value = +nutrient.value;
          break;

        case '418':
          food.nutrition.vitaminB12.value = +nutrient.value;
          break;

        case '320':
          food.nutrition.vitaminA.value = +nutrient.value;
          break;

        case '323':
          food.nutrition.vitaminE.value = +nutrient.value;
          break;

        case '328':
          food.nutrition.vitaminD.value = +nutrient.value;
          break;

        case '430':
          food.nutrition.vitaminK.value = +nutrient.value;
          break;

        case '606':
          food.nutrition.satFat.value = +nutrient.value;
          break;

        case '618':
          food.nutrition.ala.value = +nutrient.value;
          break;

        case '619':
          food.nutrition.la.value = +nutrient.value;
          break;

        case '621':
          food.nutrition.dha.value = +nutrient.value;
          break;

        case '629':
          food.nutrition.epa.value = +nutrient.value;
          break;

        case '605':
          food.nutrition.transFat.value = +nutrient.value;
          break;

        case '501':
          food.nutrition.tryptophan.value = +nutrient.value;
          break;

        case '502':
          food.nutrition.threonine.value = +nutrient.value;
          break;

        case '503':
          food.nutrition.isoleucine.value = +nutrient.value;
          break;

        case '504':
          food.nutrition.leucine.value = +nutrient.value;
          break;

        case '505':
          food.nutrition.lysine.value = +nutrient.value;
          break;

        case '506':
          food.nutrition.methionine.value = +nutrient.value;
          break;

        case '508':
          food.nutrition.phenylalanine.value = +nutrient.value;
          break;

        case '510':
          food.nutrition.valine.value = +nutrient.value;
          break;
          /*
        case '511':
          food.nutrition.arginine.value = +nutrient.value;
          break;
          */

        case '512':
          food.nutrition.histidine.value = +nutrient.value;
          break;

        case '262':
          food.nutrition.caffeine.value = +nutrient.value;
          break;

        case '221':
          food.nutrition.alcohol.value = +nutrient.value;
          break;

        default:
          break;
      }
    });
  }

  /**
   * The PRAL formula designed by Dr. Thomas Remer
   * @description Determines the food impact on the body's pH levels (above 0 is acidic and below 0 is alkaline forming)
   * @param {Food} food The food to check
   * @returns {void}
   */
  public setPRAL(food: Food): void {
    food.pral = +(0.49 * food.nutrition.protein.value + 0.037 * food.nutrition.phosphorus.value - 0.021 * food.nutrition.potassium.value - 0.026 * food.nutrition.magnesium.value - 0.013 * food.nutrition.calcium.value).toFixed(2);
  }
}
