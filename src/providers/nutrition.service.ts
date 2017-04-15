// App
import { Injectable } from '@angular/core';
import { User } from '@ionic/cloud';

// Models
import { Nutrition, UserProfile } from '../models';

// Providers
import { DRIService } from './dri.service';
import { FitnessService } from './fitness.service';

@Injectable()
export class NutritionService {

  constructor(private _driSvc: DRIService, private _fitSvc: FitnessService, private _user: User) {
  }

  public getDri(age: number, gender: string, height: number, lactating: boolean, pregnant: boolean, weight: number): Nutrition {
    let bmr: number = this._fitSvc.getBmr(age, gender, height, weight),
    requirements: Nutrition = new Nutrition();

    requirements.ala.value = this._driSvc.getALADri(bmr);
    requirements.alcohol.value = this._driSvc.getAlcoholDri(age);
    requirements.arginine.value = this._driSvc.getArginineDri(age, gender, lactating, pregnant, weight);
    requirements.caffeine.value = this._driSvc.getCaffeine(age);
    requirements.calcium.value = this._driSvc.getCalciumDri(age, gender, lactating, pregnant);
    requirements.carbs.value - this._driSvc.getCarbDri(bmr);
    requirements.choline.value = this._driSvc.getCholineDri(age, gender, lactating, pregnant);
    requirements.copper.value = this._driSvc.getCopperDri(age, gender, lactating, pregnant);
    requirements.dha.value = this._driSvc.getDHADri(bmr);
    requirements.energy.value = bmr;
    requirements.epa.value = this._driSvc.getEPADri(bmr);
    requirements.fats.value = this._driSvc.getFatDri(bmr);
    requirements.fiber.value = this._driSvc.getFiberDri(weight);
    requirements.histidine.value = this._driSvc.getHistidineDri(age, gender, lactating, pregnant, weight);
    requirements.iron.value = this._driSvc.getIronDri(age, gender, lactating, pregnant);
    requirements.isoleucine.value = this._driSvc.getIsoleucineDri(age, gender, lactating, pregnant, weight);
    requirements.la.value = this._driSvc.getLADri(bmr);
    requirements.leucine.value = this._driSvc.getLeucineDri(age, gender, lactating, pregnant, weight);
    requirements.lysine.value = this._driSvc.getLysineDri(age, gender, lactating, pregnant, weight);
    requirements.magnesium.value = this._driSvc.getMagnesiumDri(age, gender, lactating, pregnant);
    requirements.manganese.value = this._driSvc.getManganeseDri(age, gender, lactating, pregnant);
    requirements.methionine.value = this._driSvc.getMethionineDri(age, gender, lactating, pregnant, weight);
    requirements.phenylalanine.value = this._driSvc.getPhenylalanineDri(age, gender, lactating, pregnant, weight);
    requirements.phosphorus.value = this._driSvc.getPhosphorusDri(age, gender, lactating, pregnant);
    requirements.potassium.value = this._driSvc.getPotassiumDri(age, gender, lactating, pregnant);
    requirements.protein.value = this._driSvc.getProteinDri(bmr);
    requirements.selenium.value = this._driSvc.getSeleniumDri(age, gender, lactating, pregnant);
    requirements.sodium.value = this._driSvc.getSodiumDri(age, gender, lactating, pregnant);
    requirements.sugars.value = this._driSvc.getSugarsDri(bmr);
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
    requirements.zinc.value = this._driSvc.getZincDri(age, gender, lactating, pregnant);

    return requirements;
  }

}
