// App
import { Injectable } from '@angular/core';

// Third-party
import * as _ from 'lodash';

// Models
import { Food, Meal, Nutrition, NutrientDeficiencies, NutrientExcesses, Recipe, WarningMessage } from '../models';

// Providers
import { DRIService } from './dri.service';
import { FitnessService } from './fitness.service';

@Injectable()
export class NutritionService {
  constructor(
    private _driSvc: DRIService,
    private _fitSvc: FitnessService
  ) { }

  /**
  * Verifies if there is an excess of sugar
  * @param {Nutrition} nutrition - The nutrition to check
  * @param {Nutrition} requirements - The user's nutrition requirements
  * @returns {WarningMessage} Returns warning if there is too much sugar
  */
  private _checkAlcohol(nutrition: Nutrition, requirements: Nutrition): WarningMessage {
    return nutrition.alcohol.value > requirements.alcohol.value ? new WarningMessage(
      'Too much alcohol',
      `Your daily requirements are ${Math.round(requirements.alcohol.value)}g of alcohol`
    ) : null;
  }

  /**
   * Verifies if there is an excess of sugar
   * @param {Nutrition} nutrition - The nutrition to check
   * @param {Nutrition} requirements - The user's nutrition requirements
   * @returns {WarningMessage} Returns warning if there is too much sugar
   */
  private _checkCaffeine(nutrition: Nutrition, requirements: Nutrition): WarningMessage {
    return nutrition.caffeine.value > requirements.caffeine.value ? new WarningMessage(
      'Too much caffeine',
      `Your daily requirements are ${Math.round(requirements.caffeine.value)}mg of caffeine`
    ) : null;
  }

  /**
   * Verifies if there is an excess of carbohydrates
   * @param {Nutrition} nutrition - The nutrition to check
   * @param {Nutrition} requirements - The user's nutrition requirements
   * @returns {WarningMessage} Returns warning if there is too much carbohydrate
   */
  private _checkCarbs(nutrition: Nutrition, requirements: Nutrition): WarningMessage {
    return nutrition.carbs.value > requirements.carbs.value ? new WarningMessage(
      'Too much carbohydrates',
      `Your daily requirements are ${Math.round(requirements.carbs.value)}g of carbohydrates`
    ) : null;
  }

  /**
   * Verifies if there is an excess of energy
   * @param {Nutrition} nutrition - The nutrition to check
   * @param {Nutrition} requirements - The user's nutrition requirements
   * @returns {WarningMessage} Returns warning if there is too much energy
   */
  private _checkEnergy(nutrition: Nutrition, requirements: Nutrition): WarningMessage {
    return nutrition.energy.value > requirements.energy.value ? new WarningMessage(
      'Too much energy',
      `Your daily requirements are ${Math.round(requirements.energy.value)}kcal`
    ) : null;
  }

  /**
   * Verifies if there is an excess of fats
   * @param {Nutrition} nutrition - The nutrition to check
   * @param {Nutrition} requirements - The user's nutrition requirements
   * @returns {WarningMessage} Returns warning if there is too much fat
   */
  private _checkFats(nutrition: Nutrition, requirements: Nutrition): WarningMessage {
    return nutrition.fats.value > requirements.fats.value ? new WarningMessage(
      'Too much fat',
      `Your daily requirements are ${Math.round(requirements.fats.value)}g of fat`
    ) : null;
  }

  /**
 * Verifies if there is an excess of protein
 * @param {Nutrition} nutrition - The nutrition to check
 * @param {Nutrition} requirements - The user's nutrition requirements
 * @returns {WarningMessage} Returns warning if there is too much protein
 */
  private _checkProtein(nutrition: Nutrition, requirements: Nutrition): WarningMessage {
    return nutrition.protein.value > requirements.protein.value ? new WarningMessage(
      'Too much protein',
      `Your daily requirements are ${Math.round(requirements.protein.value)}g of protein`
    ) : null;
  }

  /**
   * Verifies if there is an excess of sugar
   * @param {Nutrition} nutrition - The nutrition to check
   * @param {Nutrition} requirements - The user's nutrition requirements
   * @returns {WarningMessage} Returns warning if there is too much sugar
   */
  private _checkSodium(nutrition: Nutrition, requirements: Nutrition): WarningMessage {
    return nutrition.sodium.value > requirements.sodium.value ? new WarningMessage(
      'Too much sodium',
      `Your daily requirements are ${Math.round(requirements.sodium.value)}mg of sodium`
    ) : null;
  }

  /**
 * Verifies if there is an excess of sugar
 * @param {Nutrition} nutrition - The nutrition to check
 * @param {Nutrition} requirements - The user's nutrition requirements
 * @returns {WarningMessage} Returns warning if there is too much sugar
 */
  private _checkSugar(nutrition: Nutrition, requirements: Nutrition): WarningMessage {
    return nutrition.sugar.value > requirements.sugar.value ? new WarningMessage(
      'Too much sugar',
      `Your daily requirements are ${Math.round(requirements.sugar.value)}g of sugar`
    ) : null;
  }

  /**
   * Verifies if there is an excess of sugar
   * @param {Nutrition} nutrition - The nutrition to check
   * @param {Nutrition} requirements - The user's nutrition requirements
   * @returns {WarningMessage} Returns warning if there is too much sugar
   */
  private _checkTransFat(nutrition: Nutrition, requirements: Nutrition): WarningMessage {
    return nutrition.transFat.value > requirements.transFat.value ? new WarningMessage(
      'Too much trans fat',
      `Your daily requirements are ${requirements.transFat.value}g of trans fat`
    ) : null;
  }

  /**
   * Calculates the total quanitty of several foods
   * @param {Array} items - The foods
   * @returns {number} Returns the quantity in grams of all foods
   */
  public calculateQuantity(items: Array<Food | Recipe>): number {
    return items.reduce((acc: number, item: Food) => acc + (item.quantity * item.servings), 0);
  }

 /**
  * Verifies if there are any nutritional excesses
  * @param {Nutrition} nutrition - The nutrition to check
  * @returns {Array} Returns an array of warning messages, if there are
  */
  public checkNutrition(nutrition: Nutrition): Array<WarningMessage> {
    let requirements: Nutrition = this._fitSvc.getUserRequirements()
    return _.compact([
      this._checkAlcohol(nutrition, requirements),
      this._checkCaffeine(nutrition, requirements),
      this._checkCarbs(nutrition, requirements),
      this._checkEnergy(nutrition, requirements),
      this._checkFats(nutrition, requirements),
      this._checkProtein(nutrition, requirements),
      this._checkSodium(nutrition, requirements),
      this._checkSugar(nutrition, requirements),
      this._checkTransFat(nutrition, requirements)
    ]);
  }

  public getDri(age: number, energyConsumption: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): Nutrition {
    let requirements: Nutrition = new Nutrition();

    requirements.ala.value = this._driSvc.getALADri(energyConsumption);
    requirements.alcohol.value = this._driSvc.getAlcoholDri(age);
    requirements.caffeine.value = this._driSvc.getCaffeine(age);
    requirements.calcium.value = this._driSvc.getCalciumDri(age, gender, lactating, pregnant);
    requirements.carbs.value = this._driSvc.getCarbDri(energyConsumption);
    requirements.choline.value = this._driSvc.getCholineDri(age, gender, lactating, pregnant);
    requirements.copper.value = this._driSvc.getCopperDri(age, gender, lactating, pregnant);
    requirements.dha.value = this._driSvc.getDHADri(energyConsumption);
    requirements.energy.value = energyConsumption;
    requirements.epa.value = this._driSvc.getEPADri(energyConsumption);
    requirements.fats.value = this._driSvc.getFatDri(energyConsumption);
    requirements.fiber.value = this._driSvc.getFiberDri(weight);
    requirements.histidine.value = this._driSvc.getHistidineDri(age, gender, lactating, pregnant, weight);
    requirements.iron.value = this._driSvc.getIronDri(age, gender, lactating, pregnant);
    requirements.isoleucine.value = this._driSvc.getIsoleucineDri(age, gender, lactating, pregnant, weight);
    requirements.la.value = this._driSvc.getLADri(energyConsumption);
    requirements.leucine.value = this._driSvc.getLeucineDri(age, gender, lactating, pregnant, weight);
    requirements.lysine.value = this._driSvc.getLysineDri(age, gender, lactating, pregnant, weight);
    requirements.magnesium.value = this._driSvc.getMagnesiumDri(age, gender, lactating, pregnant);
    requirements.manganese.value = this._driSvc.getManganeseDri(age, gender, lactating, pregnant);
    requirements.methionine.value = this._driSvc.getMethionineDri(age, gender, lactating, pregnant, weight);
    requirements.omega3.value = this._driSvc.getOmega3(energyConsumption);
    requirements.omega6.value = this._driSvc.getOmega6(energyConsumption);
    requirements.phenylalanine.value = this._driSvc.getPhenylalanineDri(age, gender, lactating, pregnant, weight);
    requirements.phosphorus.value = this._driSvc.getPhosphorusDri(age, gender, lactating, pregnant);
    requirements.polyunsatFat.value = this._driSvc.getPolyunsaturatedFatDri(energyConsumption);
    requirements.potassium.value = this._driSvc.getPotassiumDri(age, gender, lactating, pregnant);
    requirements.protein.value = this._driSvc.getProteinDri(energyConsumption);
    requirements.selenium.value = this._driSvc.getSeleniumDri(age, gender, lactating, pregnant);
    requirements.sodium.value = this._driSvc.getSodiumDri(age, gender, lactating, pregnant);
    requirements.sugar.value = this._driSvc.getSugarDri(energyConsumption);
    requirements.threonine.value = this._driSvc.getThreonineDri(age, gender, lactating, pregnant, weight);
    requirements.transFat.value = this._driSvc.getTransFatDri();
    requirements.tryptophan.value = this._driSvc.getTryptophanDri(age, gender, lactating, pregnant, weight);
    requirements.valine.value = this._driSvc.getValineDri(age, gender, lactating, pregnant, weight);
    requirements.vitaminA.value = this._driSvc.getVitaminADri(age, gender, lactating, pregnant);
    requirements.vitaminB1.value = this._driSvc.getThiamineDri(age, gender, lactating, pregnant);
    requirements.vitaminB2.value = this._driSvc.getRiboflavinDri(age, gender, lactating, pregnant);
    requirements.vitaminB3.value = this._driSvc.getNiacinDri(age, gender, lactating, pregnant);
    requirements.vitaminB5.value = this._driSvc.getPantothenicAcidDri(age, gender, lactating, pregnant);
    requirements.vitaminB6.value = this._driSvc.getRiboflavinDri(age, gender, lactating, pregnant);
    requirements.vitaminB9.value = this._driSvc.getFolicAcidDri(age, gender, lactating, pregnant);
    requirements.vitaminB12.value = this._driSvc.getCobalaminDri(age, gender, lactating, pregnant);
    requirements.vitaminC.value = this._driSvc.getVitaminCDri(age, gender, lactating, pregnant);
    requirements.vitaminD.value = this._driSvc.getVitaminDDri(age, gender, lactating, pregnant);
    requirements.vitaminE.value = this._driSvc.getVitaminEDri(age, gender, lactating, pregnant);
    requirements.vitaminK.value = this._driSvc.getVitaminKDri(age, gender, lactating, pregnant);
    requirements.water.value = this._driSvc.getWater(energyConsumption);
    requirements.zinc.value = this._driSvc.getZincDri(age, gender, lactating, pregnant);

    return requirements;
  }

  /**
   * Looks for nutrient deficiencies in a nutrition plan
   * @param {Nutrition} nutrition - The nutrition to look up
   * @returns {NutrientDeficiencies} Returns the deficiencies found in the plan
   */
  public getNutritionDeficiencies(nutrition: Nutrition): NutrientDeficiencies {
    let deficiencies: NutrientDeficiencies = new NutrientDeficiencies();
    for (let nutrientKey in deficiencies) {
      if (nutrition[nutrientKey].value < 75) {
        deficiencies[nutrientKey]++;
      }
    }

    return deficiencies;
  }

  /**
   * Looks for nutrient excesses in a nutrition plan
   * @param {Nutrition} nutrition - The nutrition to look up
   * @returns {NutrientExcesses} Returns the excesses found in the plan
   */
  public getNutritionExcesses(nutrition: Nutrition): NutrientExcesses {
    let excesses: NutrientExcesses = new NutrientExcesses();
    for (let nutrientKey in excesses) {
      if (nutrition[nutrientKey].value > 100) {
        excesses[nutrientKey]++;
      }
    }

    return excesses;
  }

  /**
   * Calculates the total nutritional values of an amount of foods based opn daily requirements
   * @description Each user has specific daily nutrition requirements (DRI)
   * We must know how much (%) of the requirements an amount of foods fulfill
   * @param {Array} items - The foods to sum up
   * @returns {Nutrition} Returns the nutrition of total foods
   */
  public getPercentageNutrition(items: Array<Food | Meal>, preserveEnergy: boolean = false): Nutrition {
    let nutrition: Nutrition = new Nutrition(),
      requirements: Nutrition = this._fitSvc.getUserRequirements();

    items.forEach((item: Food) => {

      // Sum the nutrients for each item
      for (let nutrientKey in requirements) {
        nutrition[nutrientKey].value += item.nutrition[nutrientKey].value;
      }
    });

    if (preserveEnergy) {
      this._fitSvc.storeEnergyIntake(nutrition.energy.value);
    }

    // Establish the meal's nutritional value, based on the user's nutritional requirements (%)
    for (let nutrientKey in nutrition) {
      nutrition[nutrientKey].value = Math.round((nutrition[nutrientKey].value * 100) / (requirements[nutrientKey].value || 1));
    }

    return nutrition;
  }

  /**
   * Gets the omega-3:omega-6 ratio
   * @desc The daily healthy ratio should be more than 0.5 (1:2), ideally 1 (1:!)
   * @param {Nutrittion} nutrition - The daily nutrition
   * @returns {number} Returns the ratio
   */
  public getOmega36Ratio(nutrition: Nutrition): number {
    return +((nutrition.omega3.value || 1) / (nutrition.omega6.value || 1)).toFixed(2);
  }

  /**
   * The PRAL formula designed by Dr. Thomas Remer
   * @description Determines if the nutritional impact on the body's pH levels (above 0 is acidic and below 0 is alkaline forming)
   * @param {Nutrition} nutrition The nutrition to check
   * @returns {void}
   */
  public getPRAL(nutrition: Nutrition): number {
    return +(0.49 * nutrition.protein.value + 0.037 * nutrition.phosphorus.value - 0.021 * nutrition.potassium.value - 0.026 * nutrition.magnesium.value - 0.013 * nutrition.calcium.value).toFixed(2);
  }

  /**
   * Calculates the total nutritional values of an amount of foods based on their servings
   * @param {Array} items - The foods to sum up
   * @returns {Nutrition} Returns the nutrition of total foods
   */
  public getTotalNutrition(items: Array<Food | Meal | Recipe>, preserveEnergy: boolean = false): Nutrition {
    let nutrition: Nutrition = new Nutrition();
    items.forEach((item: Food) => {

      // Sum the nutrients for each meal item
      for (let nutrientKey in item.nutrition) {
        nutrition[nutrientKey].value += (item.nutrition[nutrientKey].value * item.servings);
        nutrition[nutrientKey].value = +(nutrition[nutrientKey].value).toFixed(2);
      }
    });

    return nutrition;
  }

}
