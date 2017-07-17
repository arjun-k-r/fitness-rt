// App
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

// Third-party
import * as _ from 'lodash';

// Models
import {
  Food,
  Meal,
  Nutrition,
  Recipe,
  WarningMessage
} from '../../models';

// Providers
import { DRIService } from '../dri/dri.service';
import { CURRENT_DAY, FitnessService } from '../fitness/fitness.service';

@Injectable()
export class NutritionService {
  public energyIntake: number = 0;
  constructor(
    private _driSvc: DRIService,
    private _fitSvc: FitnessService,
    private _storage: Storage
  ) { }

  private _checkDeficiencies(nutrition: Nutrition): Array<WarningMessage> {
    let warnings: Array<WarningMessage> = [];
    for (let nutrientKey in nutrition) {
      if (nutrientKey !== 'alcohol' && nutrientKey !== 'caffeine' && nutrientKey !== 'carbs' && nutrientKey !== 'sugars' && nutrientKey !== 'transFat') {
        if (nutrition[nutrientKey].value < 85) {
          warnings.push(new WarningMessage(
            `Your meal plan is deficient in ${nutrition[nutrientKey].name}`,
            `Try to include more ${nutrition[nutrientKey].name} rich foods. Use the food list page to look for them.`
          ));
        }
      }
    }

    return warnings;
  }

  private _checkExcesses(nutrition: Nutrition): Array<WarningMessage> {
    let warnings: Array<WarningMessage> = [];
    if (nutrition.alcohol.value > 115) {
      warnings.push(new WarningMessage(
        'Your meal plan has excess of Alcohol',
        'Try to limit your intake of Alcohol per day'
      ))
    }

    if (nutrition.caffeine.value > 115) {
      warnings.push(new WarningMessage(
        'Your meal plan has excess of Caffeine',
        'Try to limit your intake of Caffeine per day'
      ))
    }

    if (nutrition.carbs.value > 115) {
      warnings.push(new WarningMessage(
        'Your meal plan has excess of Carbohydrates',
        'Try to limit your intake of Carbohydrates per day'
      ))
    }

    if (nutrition.sugars.value > 115) {
      warnings.push(new WarningMessage(
        'Your meal plan has excess of Sugars',
        'Try to limit your intake of Sugars per day'
      ))
    }

    if (nutrition.transFat.value > 115) {
      warnings.push(new WarningMessage(
        'Your meal plan has excess of Trans fat',
        'Try to limit your intake of Trans fat per day'
      ))
    }

    return warnings;
  }

  /**
   * Calculates the total nutritional values of an amount of foods based on their servings
   */
  public calculateNutrition(items: Array<Food | Meal | Recipe>, preserveEnergy: boolean = false): Nutrition {
    let nutrition: Nutrition = new Nutrition();
    items.forEach((item: Food) => {
      // Sum the nutrients for each meal item
      for (let nutrientKey in nutrition) {
        nutrition[nutrientKey].value += (item.nutrition[nutrientKey].value * item.servings);
        nutrition[nutrientKey].value = +(nutrition[nutrientKey].value).toFixed(2);
      }
    });

    return nutrition;
  }

  /**
   * Calculates the daily nutrition intake percentage of the daily requirements
   */
  public calculateNutritionPercent(items: Array<Food | Meal | Recipe>, preserveEnergy: boolean = false): Promise<Nutrition> {
    return new Promise((resolve, reject) => {
      let nutrition: Nutrition = new Nutrition();
      this._storage.ready().then(() => {
        this._storage.get(`userRequirements${CURRENT_DAY}`).then((requirements: Nutrition) => {
          items.forEach((item: Food) => {
            // Sum the nutrients for each item
            for (let nutrientKey in requirements) {
              nutrition[nutrientKey].value += item.nutrition[nutrientKey].value;
            }
          });

          // Save the energy intake to calculate the left energy in activity plan
          if (preserveEnergy) {
            this._storage.set(`energyInput${CURRENT_DAY}`, nutrition.energy.value)
          }

          // Establish the meal's nutritional value, based on the user's nutritional requirements (%)
          for (let nutrientKey in nutrition) {
            nutrition[nutrientKey].value = Math.round((nutrition[nutrientKey].value * 100) / (requirements[nutrientKey].value || 1));
          }
          resolve(nutrition);
        }).catch((err: Error) => reject(err));
      }).catch((err: Error) => reject(err));
    });
  }

  /**
   * The PRAL formula designed by Dr. Thomas Remer
   */
  public calculatePRAL(nutrition: Nutrition): number {
    return 0.49 * nutrition.protein.value + 0.037 * nutrition.phosphorus.value - 0.021 * nutrition.potassium.value - 0.026 * nutrition.magnesium.value - 0.013 * nutrition.calcium.value;
  }

  public calculateQuantity(items: Array<Food | Recipe>): number {
    return items.reduce((acc: number, item: Food) => acc + (item.quantity * item.servings), 0);
  }

  public checkNutrition(nutrition: Nutrition): Array<WarningMessage> {
    return _.compact([
      ...this._checkDeficiencies(nutrition),
      ...this._checkExcesses(nutrition)
    ]);
  }

  public getDri(age: number, bmr: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): Promise<Nutrition> {
    return new Promise((resolve, reject) => {
      this._storage.ready().then((storage: LocalForage) => {
        this._storage.get(`energyOutput${CURRENT_DAY}`).then((energyOuptut: number = 0) => {
          let requirements: Nutrition = new Nutrition();
          requirements.ala.value = this._driSvc.getALADri(energyOuptut + bmr);
          requirements.alcohol.value = this._driSvc.getAlcoholDri(age);
          requirements.caffeine.value = this._driSvc.getCaffeine(age);
          requirements.calcium.value = this._driSvc.getCalciumDri(age, gender, lactating, pregnant);
          requirements.carbs.value = this._driSvc.getCarbDri(energyOuptut + bmr);
          requirements.choline.value = this._driSvc.getCholineDri(age, gender, lactating, pregnant);
          requirements.copper.value = this._driSvc.getCopperDri(age, gender, lactating, pregnant);
          requirements.dha.value = this._driSvc.getDHADri(energyOuptut + bmr);
          requirements.energy.value = energyOuptut + bmr;
          requirements.epa.value = this._driSvc.getEPADri(energyOuptut + bmr);
          requirements.fats.value = this._driSvc.getFatDri(energyOuptut + bmr);
          requirements.fiber.value = this._driSvc.getFiberDri(weight);
          requirements.histidine.value = this._driSvc.getHistidineDri(age, gender, lactating, pregnant, weight);
          requirements.iron.value = this._driSvc.getIronDri(age, gender, lactating, pregnant);
          requirements.isoleucine.value = this._driSvc.getIsoleucineDri(age, gender, lactating, pregnant, weight);
          requirements.la.value = this._driSvc.getLADri(energyOuptut + bmr);
          requirements.leucine.value = this._driSvc.getLeucineDri(age, gender, lactating, pregnant, weight);
          requirements.lysine.value = this._driSvc.getLysineDri(age, gender, lactating, pregnant, weight);
          requirements.magnesium.value = this._driSvc.getMagnesiumDri(age, gender, lactating, pregnant);
          requirements.manganese.value = this._driSvc.getManganeseDri(age, gender, lactating, pregnant);
          requirements.methionine.value = this._driSvc.getMethionineDri(age, gender, lactating, pregnant, weight);
          requirements.phenylalanine.value = this._driSvc.getPhenylalanineDri(age, gender, lactating, pregnant, weight);
          requirements.phosphorus.value = this._driSvc.getPhosphorusDri(age, gender, lactating, pregnant);
          requirements.potassium.value = this._driSvc.getPotassiumDri(age, gender, lactating, pregnant);
          requirements.protein.value = this._driSvc.getProteinDri(energyOuptut + bmr);
          requirements.selenium.value = this._driSvc.getSeleniumDri(age, gender, lactating, pregnant);
          requirements.sodium.value = this._driSvc.getSodiumDri(age, gender, lactating, pregnant);
          requirements.sugars.value = this._driSvc.getSugarsDri(energyOuptut + bmr);
          requirements.threonine.value = this._driSvc.getThreonineDri(age, gender, lactating, pregnant, weight);
          requirements.transFat.value = this._driSvc.getTransFatDri(energyOuptut + bmr);
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
          requirements.vitaminD.value = this._driSvc.getVitaminDDri();
          requirements.vitaminE.value = this._driSvc.getVitaminEDri(age, gender, lactating, pregnant);
          requirements.vitaminK.value = this._driSvc.getVitaminKDri(age, gender, lactating, pregnant);
          requirements.water.value = this._driSvc.getWater(energyOuptut + bmr);
          requirements.zinc.value = this._driSvc.getZincDri(age, gender, lactating, pregnant);
          resolve(requirements);
        }).catch((err: Error) => reject(err));
      }).catch((err: Error) => reject(err));
    });
  }
}
