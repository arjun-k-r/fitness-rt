// App
import { Injectable } from '@angular/core';
import { User } from '@ionic/cloud';

// Models
import { Nutrition, UserProfile } from '../models';

// Providers
import { ProfileService } from './profile.service';

@Injectable()
export class NutritionService {

  constructor(private _profileSvc: ProfileService, private _user: User) {
  }

  /**
   * TODO: Add requirements methods for each nutrient
   * Tip: Use switch to find the age interval
   */

  private _getOmega3Dri(age: number, energyConsumption: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (age <= 1) {
      return 0.03 * energyConsumption;
    } else if (age <= 14) {
      return 0.03 * energyConsumption;
    } else if (gender === 'male') {
      return 0.03 * energyConsumption
    } else {
      return lactating ? 0.03 * energyConsumption : pregnant ? 0.03 * energyConsumption : 0.03 * energyConsumption;
    }
  }

  public getDri(age: number, gender: string, height: number, lactating: boolean, pregnant: boolean, weight: number): Nutrition {
    let bmr: number = this._profileSvc.getBmr(age, gender, height, weight),
    requirements: Nutrition = new Nutrition();

    requirements.omega3.value = this._getOmega3Dri(age, bmr, gender, lactating, pregnant, weight);

    return requirements;
  }

}
