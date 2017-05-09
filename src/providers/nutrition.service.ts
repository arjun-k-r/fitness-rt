// App
import { Injectable } from '@angular/core';

// Models
import { Food, Meal, Nutrition, NutrientDeficiencies, NutrientExcesses, Recipe } from '../models';

// Providers
import { DRIService } from './dri.service';
import { FitnessService } from './fitness.service';

@Injectable()
export class NutritionService {

  constructor(private _driSvc: DRIService, private _fitSvc: FitnessService) {
  }

  public getDri(age: number, energyConsumption: number, gender: string, height: number, lactating: boolean, pregnant: boolean, weight: number): Nutrition {
    let requirements: Nutrition = new Nutrition();

    requirements.ala.value = this._driSvc.getALADri(energyConsumption);
    requirements.alcohol.value = this._driSvc.getAlcoholDri(age);
    //requirements.arginine.value = this._driSvc.getArginineDri(age, gender, lactating, pregnant, weight);
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
    requirements.phenylalanine.value = this._driSvc.getPhenylalanineDri(age, gender, lactating, pregnant, weight);
    requirements.phosphorus.value = this._driSvc.getPhosphorusDri(age, gender, lactating, pregnant);
    requirements.potassium.value = this._driSvc.getPotassiumDri(age, gender, lactating, pregnant);
    requirements.protein.value = this._driSvc.getProteinDri(energyConsumption);
    requirements.selenium.value = this._driSvc.getSeleniumDri(age, gender, lactating, pregnant);
    requirements.sodium.value = this._driSvc.getSodiumDri(age, gender, lactating, pregnant);
    requirements.sugars.value = this._driSvc.getSugarsDri(energyConsumption);
    requirements.threonine.value = this._driSvc.getThreonineDri(age, gender, lactating, pregnant, weight);
    requirements.transFat.value = this._driSvc.getTransFatDri();
    requirements.tryptophan.value = this._driSvc.getTryptophanDri(age, gender, lactating, pregnant, weight);
    requirements.valine.value = this._driSvc.getValineDri(age, gender, lactating, pregnant, weight);
    requirements.vitaminA.value = this._driSvc.getVitaminADri(age, gender, lactating, pregnant);
    requirements.vitaminB1.value = this._driSvc.getThiamineDri(age, gender, lactating, pregnant);
    requirements.vitaminB2.value = this._driSvc.getRiboflavinDri(age, gender, lactating, pregnant);
    requirements.vitaminB3.value = this._driSvc.getNiacinDri(age, gender, lactating, pregnant);
    requirements.vitaminB5.value = this._driSvc.getPantothenicAcidDri(age, gender, lactating, pregnant);
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
   * Calculates the alkalinity of couple of foods
   * @param {Array} items - The foods
   * @returns {number} Returns the pral of all foods
   */
  public calculatePral(items: Array<Food | Recipe>): number {
    return +(items.reduce((acc: number, item: Food) => acc + (item.pral * item.servings), 0)).toFixed(2)
  }

  /**
   * Calculates the total quanitty of several foods
   * @param {Array} items - The foods
   * @returns {number} Returns the quantity in grams of all foods
   */
  public calculateQuantity(items: Array<Food | Recipe>): number {
    return items.reduce((acc: number, item: Food) => acc + item.quantity, 0);
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

      // Sum the nutrients for each food
      for (let nutrientKey in item.nutrition) {
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
   * Calculates the total nutritional values of an amount of foods
   * @param {Array} items - The foods to sum up
   * @returns {Nutrition} Returns the nutrition of total foods
   */
  public getTotalNutrition(items: Array<Food | Meal | Recipe>, preserveEnergy: boolean = false): Nutrition {
    let nutrition: Nutrition = new Nutrition();
    items.forEach((item: Food) => {

      // Sum the nutrients for each meal item
      for (let nutrientKey in item.nutrition) {
        nutrition[nutrientKey].value += item.nutrition[nutrientKey].value;
        nutrition[nutrientKey].value = +(nutrition[nutrientKey].value).toFixed(2);
      }
    });

    return nutrition;
  }

}
