// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Firebase
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Fitness, Nutrition } from '../../models';

// Providers
import { ActivityProvider } from '../activity/activity';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class NutritionProvider {

  constructor(
    private _activityPvd: ActivityProvider,
    private _db: AngularFireDatabase
  ) { }

  private _calculateALADailyRequirements(energyConsumption: number): number {
    return 0.005 * energyConsumption / 9;
  }

  private _calculateAlcoholDailyRequirements(age: number): number {
    return age > 18 ? 10 : 0;
  }

  /**
   * Redundant for now
  private _calculateBiotinDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      return 35;
    } else if (pregnant) {
      return 30;
    } else if (age <= 1) {
      return 6;
    } else if (age <= 3) {
      return 8;
    } else if (age <= 8) {
      return 12;
    } else if (age <= 13) {
      return 20;
    } else if (age <= 18) {
      return 25;
    } else if (age <= 30) {
      return 30;
    } else if (age <= 50) {
      return 30;
    } else if (age <= 70) {
      return 30;
    } else {
      return 30;
    }
  }
  */

  private _calculateCaffeine(age: number): number {
    return age > 14 ? 300 : 0;
  }

  private _calculateCalciumDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 1300;
      } else {
        return 1000;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 1300;
      } else {
        return 1000;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 270;
      } else if (age <= 3) {
        return 500;
      } else if (age <= 8) {
        return 800;
      } else if (age <= 13) {
        return 1300;
      } else if (age <= 18) {
        return 1300;
      } else if (age <= 30) {
        return 1000;
      } else if (age <= 50) {
        return 1000;
      } else if (age <= 70) {
        return 1200;
      } else {
        return 1200;
      }
    } else {
      if (age <= 1) {
        return 270;
      } else if (age <= 3) {
        return 500;
      } else if (age <= 8) {
        return 800;
      } else if (age <= 13) {
        return 1300;
      } else if (age <= 18) {
        return 1300;
      } else if (age <= 30) {
        return 1000;
      } else if (age <= 50) {
        return 1000;
      } else if (age <= 70) {
        return 1200;
      } else {
        return 1200;
      }
    }
  }

  private _calculateCarbDailyRequirements(energyConsumption: number): number {
    return 0.45 * energyConsumption / 4;
  }

  /**
   * Redundant for now
  private _calculateChlorideDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 2.3;
      } else {
        return 2.3;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 2.3;
      } else {
        return 2.3;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 0.57;
      } else if (age <= 3) {
        return 1.5;
      } else if (age <= 8) {
        return 1.9;
      } else if (age <= 13) {
        return 2.3;
      } else if (age <= 18) {
        return 2.3;
      } else if (age <= 30) {
        return 2.3;
      } else if (age <= 50) {
        return 2.3;
      } else if (age <= 70) {
        return 2;
      } else {
        return 1.8;
      }
    } else {
      if (age <= 1) {
        return 0.57;
      } else if (age <= 3) {
        return 1.5;
      } else if (age <= 8) {
        return 1.9;
      } else if (age <= 13) {
        return 2.3;
      } else if (age <= 18) {
        return 2.3;
      } else if (age <= 30) {
        return 2.3;
      } else if (age <= 50) {
        return 2.3;
      } else if (age <= 70) {
        return 2;
      } else {
        return 1.8;
      }
    }
  }
  */

  private _calculateCholineDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 550;
      } else {
        return 550;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 450;
      } else {
        return 450;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 150;
      } else if (age <= 3) {
        return 200;
      } else if (age <= 8) {
        return 250;
      } else if (age <= 13) {
        return 375;
      } else if (age <= 18) {
        return 400;
      } else if (age <= 30) {
        return 425;
      } else if (age <= 50) {
        return 425;
      } else if (age <= 70) {
        return 425;
      } else {
        return 425;
      }
    } else {
      if (age <= 1) {
        return 150;
      } else if (age <= 3) {
        return 200;
      } else if (age <= 8) {
        return 250;
      } else if (age <= 13) {
        return 375;
      } else if (age <= 18) {
        return 550;
      } else if (age <= 30) {
        return 550;
      } else if (age <= 50) {
        return 550;
      } else if (age <= 70) {
        return 550;
      } else {
        return 550;
      }
    }
  }

  /**
   * Redundant for now
  private _calculateChromiumDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 44;
      } else {
        return 45;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 29;
      } else {
        return 30;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 5.5;
      } else if (age <= 3) {
        return 11;
      } else if (age <= 8) {
        return 15;
      } else if (age <= 13) {
        return 21;
      } else if (age <= 18) {
        return 24;
      } else if (age <= 30) {
        return 25;
      } else if (age <= 50) {
        return 25;
      } else if (age <= 70) {
        return 20;
      } else {
        return 20;
      }
    } else {
      if (age <= 1) {
        return 5.5;
      } else if (age <= 3) {
        return 11;
      } else if (age <= 8) {
        return 15;
      } else if (age <= 13) {
        return 25;
      } else if (age <= 18) {
        return 35;
      } else if (age <= 30) {
        return 35;
      } else if (age <= 50) {
        return 35;
      } else if (age <= 70) {
        return 30;
      } else {
        return 30;
      }
    }
  }
  */

  private _calculateCobalaminDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 2.8;
      } else {
        return 2.8;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 2.6;
      } else {
        return 2.6;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 1.2;
      } else if (age <= 3) {
        return 1.8;
      } else if (age <= 8) {
        return 2.4;
      } else if (age <= 13) {
        return 2.4;
      } else if (age <= 18) {
        return 2.4;
      } else if (age <= 30) {
        return 2.4;
      } else if (age <= 50) {
        return 2.4;
      } else if (age <= 70) {
        return 2.4;
      } else {
        return 2.4;
      }
    } else {
      if (age <= 1) {
        return 1.2;
      } else if (age <= 3) {
        return 1.8;
      } else if (age <= 8) {
        return 2.4;
      } else if (age <= 13) {
        return 2.4;
      } else if (age <= 18) {
        return 2.4;
      } else if (age <= 30) {
        return 2.4;
      } else if (age <= 50) {
        return 2.4;
      } else if (age <= 70) {
        return 2.4;
      } else {
        return 2.4;
      }
    }
  }

  private _calculateCopperDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 1300;
      } else {
        return 1300;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 1000;
      } else {
        return 1000;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 340;
      } else if (age <= 3) {
        return 440;
      } else if (age <= 8) {
        return 700;
      } else if (age <= 13) {
        return 890;
      } else if (age <= 18) {
        return 900;
      } else if (age <= 30) {
        return 900;
      } else if (age <= 50) {
        return 900;
      } else if (age <= 70) {
        return 900;
      } else {
        return 900;
      }
    } else {
      if (age <= 1) {
        return 340;
      } else if (age <= 3) {
        return 440;
      } else if (age <= 8) {
        return 700;
      } else if (age <= 13) {
        return 890;
      } else if (age <= 18) {
        return 900;
      } else if (age <= 30) {
        return 900;
      } else if (age <= 50) {
        return 900;
      } else if (age <= 70) {
        return 900;
      } else {
        return 900;
      }
    }
  }

  private _calculateDHADailyRequirements(energyConsumption: number): number {
    return 0.0025 * energyConsumption / 9;
  }

  private _calculateEPADailyRequirements(energyConsumption: number): number {
    return 0.0025 * energyConsumption / 9;
  }

  private _calculateFatDailyRequirements(energyConsumption: number): number {
    return 0.3 * energyConsumption / 9;
  }

  private _calculateFiberDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 29;
      } else {
        return 29;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 28;
      } else {
        return 28;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 19;
      } else if (age <= 3) {
        return 19;
      } else if (age <= 8) {
        return 25;
      } else if (age <= 13) {
        return 26;
      } else if (age <= 18) {
        return 26;
      } else if (age <= 30) {
        return 25;
      } else if (age <= 50) {
        return 25;
      } else if (age <= 70) {
        return 21;
      } else {
        return 21;
      }
    } else {
      if (age <= 1) {
        return 19;
      } else if (age <= 3) {
        return 19;
      } else if (age <= 8) {
        return 25;
      } else if (age <= 13) {
        return 31;
      } else if (age <= 18) {
        return 38;
      } else if (age <= 30) {
        return 38;
      } else if (age <= 50) {
        return 38;
      } else if (age <= 70) {
        return 30;
      } else {
        return 30;
      }
    }
  }

  private _calculateFolicAcidDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 500;
      } else {
        return 500;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 600;
      } else {
        return 600;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 150;
      } else if (age <= 3) {
        return 150;
      } else if (age <= 8) {
        return 200;
      } else if (age <= 13) {
        return 300;
      } else if (age <= 18) {
        return 400;
      } else if (age <= 30) {
        return 400;
      } else if (age <= 50) {
        return 400;
      } else if (age <= 70) {
        return 400;
      } else {
        return 400;
      }
    } else {
      if (age <= 1) {
        return 150;
      } else if (age <= 3) {
        return 150;
      } else if (age <= 8) {
        return 200;
      } else if (age <= 13) {
        return 300;
      } else if (age <= 18) {
        return 400;
      } else if (age <= 30) {
        return 400;
      } else if (age <= 50) {
        return 400;
      } else if (age <= 70) {
        return 400;
      } else {
        return 400;
      }
    }
  }

  private _calculateHistidineDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (lactating) {
      if (age <= 18) {
        return 0.019 * weight;
      } else {
        return 0.019 * weight;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 0.018 * weight;
      } else {
        return 0.018 * weight;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 0.032 * weight;
      } else if (age <= 3) {
        return 0.021 * weight;
      } else if (age <= 8) {
        return 0.016 * weight;
      } else if (age <= 13) {
        return 0.015 * weight;
      } else if (age <= 18) {
        return 0.014 * weight;
      } else if (age <= 30) {
        return 0.014 * weight;
      } else if (age <= 50) {
        return 0.014 * weight;
      } else if (age <= 70) {
        return 0.014 * weight;
      } else {
        return 0.014 * weight;
      }
    } else {
      if (age <= 1) {
        return 0.032 * weight;
      } else if (age <= 3) {
        return 0.021 * weight;
      } else if (age <= 8) {
        return 0.016 * weight;
      } else if (age <= 13) {
        return 0.017 * weight;
      } else if (age <= 18) {
        return 0.015 * weight;
      } else if (age <= 30) {
        return 0.014 * weight;
      } else if (age <= 50) {
        return 0.014 * weight;
      } else if (age <= 70) {
        return 0.014 * weight;
      } else {
        return 0.014 * weight;
      }
    }
  }

  /**
   * Redundant for now
  private _calculateIodineDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 290;
      } else {
        return 290;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 220;
      } else {
        return 220;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 90;
      } else if (age <= 3) {
        return 90;
      } else if (age <= 8) {
        return 120;
      } else if (age <= 13) {
        return 150;
      } else if (age <= 18) {
        return 150;
      } else if (age <= 30) {
        return 150;
      } else if (age <= 50) {
        return 150;
      } else if (age <= 70) {
        return 150;
      } else {
        return 150;
      }
    } else {
      if (age <= 1) {
        return 90;
      } else if (age <= 3) {
        return 90;
      } else if (age <= 8) {
        return 120;
      } else if (age <= 13) {
        return 150;
      } else if (age <= 18) {
        return 150;
      } else if (age <= 30) {
        return 150;
      } else if (age <= 50) {
        return 150;
      } else if (age <= 70) {
        return 150;
      } else {
        return 150;
      }
    }
  }
  */

  private _calculateIronDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 10;
      } else {
        return 9;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 27;
      } else {
        return 27;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 11;
      } else if (age <= 3) {
        return 7;
      } else if (age <= 8) {
        return 10;
      } else if (age <= 13) {
        return 8;
      } else if (age <= 18) {
        return 15;
      } else if (age <= 30) {
        return 18;
      } else if (age <= 50) {
        return 18;
      } else if (age <= 70) {
        return 8;
      } else {
        return 8;
      }
    } else {
      if (age <= 1) {
        return 11;
      } else if (age <= 3) {
        return 7;
      } else if (age <= 8) {
        return 10;
      } else if (age <= 13) {
        return 8;
      } else if (age <= 18) {
        return 11;
      } else if (age <= 30) {
        return 8;
      } else if (age <= 50) {
        return 8;
      } else if (age <= 70) {
        return 8;
      } else {
        return 8;
      }
    }
  }

  private _calculateIsoleucineDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (lactating) {
      if (age <= 18) {
        return 0.03 * weight;
      } else {
        return 0.03 * weight;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 0.025 * weight;
      } else {
        return 0.025 * weight;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 0.043 * weight;
      } else if (age <= 3) {
        return 0.028 * weight;
      } else if (age <= 8) {
        return 0.022 * weight;
      } else if (age <= 13) {
        return 0.021 * weight;
      } else if (age <= 18) {
        return 0.019 * weight;
      } else if (age <= 30) {
        return 0.019 * weight;
      } else if (age <= 50) {
        return 0.019 * weight;
      } else if (age <= 70) {
        return 0.019 * weight;
      } else {
        return 0.019 * weight;
      }
    } else {
      if (age <= 1) {
        return 0.043 * weight;
      } else if (age <= 3) {
        return 0.028 * weight;
      } else if (age <= 8) {
        return 0.022 * weight;
      } else if (age <= 13) {
        return 0.022 * weight;
      } else if (age <= 18) {
        return 0.021 * weight;
      } else if (age <= 30) {
        return 0.019 * weight;
      } else if (age <= 50) {
        return 0.019 * weight;
      } else if (age <= 70) {
        return 0.019 * weight;
      } else {
        return 0.019 * weight;
      }
    }
  }

  private _calculateLADailyRequirements(energyConsumption: number): number {
    return 0.005 * energyConsumption / 9;
  }

  private _calculateLeucineDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (lactating) {
      if (age <= 18) {
        return 0.062 * weight;
      } else {
        return 0.062 * weight;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 0.056 * weight;
      } else {
        return 0.056 * weight;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 0.093 * weight;
      } else if (age <= 3) {
        return 0.063 * weight;
      } else if (age <= 8) {
        return 0.049 * weight;
      } else if (age <= 13) {
        return 0.047 * weight;
      } else if (age <= 18) {
        return 0.044 * weight;
      } else if (age <= 30) {
        return 0.042 * weight;
      } else if (age <= 50) {
        return 0.042 * weight;
      } else if (age <= 70) {
        return 0.042 * weight;
      } else {
        return 0.042 * weight;
      }
    } else {
      if (age <= 1) {
        return 0.093 * weight;
      } else if (age <= 3) {
        return 0.063 * weight;
      } else if (age <= 8) {
        return 0.049 * weight;
      } else if (age <= 13) {
        return 0.049 * weight;
      } else if (age <= 18) {
        return 0.047 * weight;
      } else if (age <= 30) {
        return 0.042 * weight;
      } else if (age <= 50) {
        return 0.042 * weight;
      } else if (age <= 70) {
        return 0.042 * weight;
      } else {
        return 0.042 * weight;
      }
    }
  }

  private _calculateLysineDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (lactating) {
      if (age <= 18) {
        return 0.052 * weight;
      } else {
        return 0.052 * weight;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 0.051 * weight;
      } else {
        return 0.051 * weight;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 0.089 * weight;
      } else if (age <= 3) {
        return 0.058 * weight;
      } else if (age <= 8) {
        return 0.046 * weight;
      } else if (age <= 13) {
        return 0.043 * weight;
      } else if (age <= 18) {
        return 0.04 * weight;
      } else if (age <= 30) {
        return 0.038 * weight;
      } else if (age <= 50) {
        return 0.038 * weight;
      } else if (age <= 70) {
        return 0.038 * weight;
      } else {
        return 0.038 * weight;
      }
    } else {
      if (age <= 1) {
        return 0.089 * weight;
      } else if (age <= 3) {
        return 0.058 * weight;
      } else if (age <= 8) {
        return 0.046 * weight;
      } else if (age <= 13) {
        return 0.046 * weight;
      } else if (age <= 18) {
        return 0.043 * weight;
      } else if (age <= 30) {
        return 0.038 * weight;
      } else if (age <= 50) {
        return 0.038 * weight;
      } else if (age <= 70) {
        return 0.038 * weight;
      } else {
        return 0.038 * weight;
      }
    }
  }

  private _calculateMagnesiumDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 360;
      } else if (age <= 30) {
        return 310;
      } else {
        return 320;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 400;
      } else if (age <= 30) {
        return 350;
      } else {
        return 360;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 80;
      } else if (age <= 3) {
        return 80;
      } else if (age <= 8) {
        return 130;
      } else if (age <= 13) {
        return 240;
      } else if (age <= 18) {
        return 360;
      } else if (age <= 30) {
        return 310;
      } else if (age <= 50) {
        return 320;
      } else if (age <= 70) {
        return 320;
      } else {
        return 320;
      }
    } else {
      if (age <= 1) {
        return 80;
      } else if (age <= 3) {
        return 80;
      } else if (age <= 8) {
        return 130;
      } else if (age <= 13) {
        return 240;
      } else if (age <= 18) {
        return 410;
      } else if (age <= 30) {
        return 400;
      } else if (age <= 50) {
        return 420;
      } else if (age <= 70) {
        return 420;
      } else {
        return 420;
      }
    }
  }

  private _calculateManganeseDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 2.6;
      } else {
        return 2.6;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 2;
      } else {
        return 2;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 0.6;
      } else if (age <= 3) {
        return 1.2;
      } else if (age <= 8) {
        return 1.5;
      } else if (age <= 13) {
        return 1.6;
      } else if (age <= 18) {
        return 1.6;
      } else if (age <= 30) {
        return 1.8;
      } else if (age <= 50) {
        return 1.8;
      } else if (age <= 70) {
        return 1.8;
      } else {
        return 1.8;
      }
    } else {
      if (age <= 1) {
        return 0.6;
      } else if (age <= 3) {
        return 1.2;
      } else if (age <= 8) {
        return 1.5;
      } else if (age <= 13) {
        return 1.9;
      } else if (age <= 18) {
        return 2.2;
      } else if (age <= 30) {
        return 2.3;
      } else if (age <= 50) {
        return 2.3;
      } else if (age <= 70) {
        return 2.3;
      } else {
        return 2.3;
      }
    }
  }

  private _calculateMethionineDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (lactating) {
      if (age <= 18) {
        return 0.026 * weight;
      } else {
        return 0.026 * weight;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 0.025 * weight;
      } else {
        return 0.025 * weight;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 0.043 * weight;
      } else if (age <= 3) {
        return 0.028 * weight;
      } else if (age <= 8) {
        return 0.022 * weight;
      } else if (age <= 13) {
        return 0.021 * weight;
      } else if (age <= 18) {
        return 0.019 * weight;
      } else if (age <= 30) {
        return 0.019 * weight;
      } else if (age <= 50) {
        return 0.019 * weight;
      } else if (age <= 70) {
        return 0.019 * weight;
      } else {
        return 0.019 * weight;
      }
    } else {
      if (age <= 1) {
        return 0.043 * weight;
      } else if (age <= 3) {
        return 0.028 * weight;
      } else if (age <= 8) {
        return 0.022 * weight;
      } else if (age <= 13) {
        return 0.022 * weight;
      } else if (age <= 18) {
        return 0.021 * weight;
      } else if (age <= 30) {
        return 0.019 * weight;
      } else if (age <= 50) {
        return 0.019 * weight;
      } else if (age <= 70) {
        return 0.019 * weight;
      } else {
        return 0.019 * weight;
      }
    }
  }

  /**
   * Redundant for now
  private _calculateMolybdenumDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 50;
      } else {
        return 50;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 50;
      } else {
        return 50;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 17;
      } else if (age <= 3) {
        return 17;
      } else if (age <= 8) {
        return 22;
      } else if (age <= 13) {
        return 34;
      } else if (age <= 18) {
        return 43;
      } else if (age <= 30) {
        return 45;
      } else if (age <= 50) {
        return 45;
      } else if (age <= 70) {
        return 45;
      } else {
        return 45;
      }
    } else {
      if (age <= 1) {
        return 17;
      } else if (age <= 3) {
        return 17;
      } else if (age <= 8) {
        return 22;
      } else if (age <= 13) {
        return 34;
      } else if (age <= 18) {
        return 43;
      } else if (age <= 30) {
        return 45;
      } else if (age <= 50) {
        return 45;
      } else if (age <= 70) {
        return 45;
      } else {
        return 45;
      }
    }
  }
  */

  private _calculateNiacinDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 17;
      } else {
        return 17;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 18;
      } else {
        return 18;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 6;
      } else if (age <= 3) {
        return 6;
      } else if (age <= 8) {
        return 8;
      } else if (age <= 13) {
        return 12;
      } else if (age <= 18) {
        return 14;
      } else if (age <= 30) {
        return 14;
      } else if (age <= 50) {
        return 14;
      } else if (age <= 70) {
        return 14;
      } else {
        return 14;
      }
    } else {
      if (age <= 1) {
        return 6;
      } else if (age <= 3) {
        return 6;
      } else if (age <= 8) {
        return 8;
      } else if (age <= 13) {
        return 12;
      } else if (age <= 18) {
        return 16;
      } else if (age <= 30) {
        return 16;
      } else if (age <= 50) {
        return 16;
      } else if (age <= 70) {
        return 16;
      } else {
        return 16;
      }
    }
  }

  private _calculatePantothenicAcidDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 7;
      } else {
        return 7;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 6;
      } else {
        return 6;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 1.8;
      } else if (age <= 3) {
        return 2;
      } else if (age <= 8) {
        return 3;
      } else if (age <= 13) {
        return 4;
      } else if (age <= 18) {
        return 5;
      } else if (age <= 30) {
        return 5;
      } else if (age <= 50) {
        return 5;
      } else if (age <= 70) {
        return 5;
      } else {
        return 5;
      }
    } else {
      if (age <= 1) {
        return 1.8;
      } else if (age <= 3) {
        return 2;
      } else if (age <= 8) {
        return 3;
      } else if (age <= 13) {
        return 4;
      } else if (age <= 18) {
        return 5;
      } else if (age <= 30) {
        return 5;
      } else if (age <= 50) {
        return 5;
      } else if (age <= 70) {
        return 5;
      } else {
        return 5;
      }
    }
  }

  private _calculatePhenylalanineDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (lactating) {
      if (age <= 18) {
        return 0.051 * weight;
      } else {
        return 0.051 * weight;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 0.044 * weight;
      } else {
        return 0.044 * weight;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 0.084 * weight;
      } else if (age <= 3) {
        return 0.054 * weight;
      } else if (age <= 8) {
        return 0.041 * weight;
      } else if (age <= 13) {
        return 0.038 * weight;
      } else if (age <= 18) {
        return 0.035 * weight;
      } else if (age <= 30) {
        return 0.033 * weight;
      } else if (age <= 50) {
        return 0.033 * weight;
      } else if (age <= 70) {
        return 0.033 * weight;
      } else {
        return 0.033 * weight;
      }
    } else {
      if (age <= 1) {
        return 0.084 * weight;
      } else if (age <= 3) {
        return 0.054 * weight;
      } else if (age <= 8) {
        return 0.041 * weight;
      } else if (age <= 13) {
        return 0.041 * weight;
      } else if (age <= 18) {
        return 0.038 * weight;
      } else if (age <= 30) {
        return 0.033 * weight;
      } else if (age <= 50) {
        return 0.033 * weight;
      } else if (age <= 70) {
        return 0.033 * weight;
      } else {
        return 0.033 * weight;
      }
    }
  }

  private _calculatePhosphorusDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 1250;
      } else {
        return 700;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 1250;
      } else {
        return 700;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 460;
      } else if (age <= 3) {
        return 500;
      } else if (age <= 8) {
        return 1250;
      } else if (age <= 13) {
        return 1250;
      } else if (age <= 18) {
        return 700;
      } else if (age <= 30) {
        return 700;
      } else if (age <= 50) {
        return 700;
      } else if (age <= 70) {
        return 700;
      } else {
        return 700;
      }
    } else {
      if (age <= 1) {
        return 460;
      } else if (age <= 3) {
        return 500;
      } else if (age <= 8) {
        return 1250;
      } else if (age <= 13) {
        return 1250;
      } else if (age <= 18) {
        return 700;
      } else if (age <= 30) {
        return 700;
      } else if (age <= 50) {
        return 700;
      } else if (age <= 70) {
        return 700;
      } else {
        return 700;
      }
    }
  }

  private _calculatePotassiumDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 5100;
      } else {
        return 5100;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 4700;
      } else {
        return 4700;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 700;
      } else if (age <= 3) {
        return 3000;
      } else if (age <= 8) {
        return 3800;
      } else if (age <= 13) {
        return 4500;
      } else if (age <= 18) {
        return 4700;
      } else if (age <= 30) {
        return 4700;
      } else if (age <= 50) {
        return 4700;
      } else if (age <= 70) {
        return 4700;
      } else {
        return 4700;
      }
    } else {
      if (age <= 1) {
        return 700;
      } else if (age <= 3) {
        return 3000;
      } else if (age <= 8) {
        return 3800;
      } else if (age <= 13) {
        return 4500;
      } else if (age <= 18) {
        return 4700;
      } else if (age <= 30) {
        return 4700;
      } else if (age <= 50) {
        return 4700;
      } else if (age <= 70) {
        return 4700;
      } else {
        return 4700;
      }
    }
  }

  private _calculateProteinDailyRequirements(energyConsumption: number): number {
    return 0.25 * energyConsumption / 4;
  }

  private _calculatePyridoxineDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 2;
      } else {
        return 2;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 1.9;
      } else {
        return 1.9;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 0.5;
      } else if (age <= 3) {
        return 0.5;
      } else if (age <= 8) {
        return 0.6;
      } else if (age <= 13) {
        return 1;
      } else if (age <= 18) {
        return 1.2;
      } else if (age <= 30) {
        return 1.3;
      } else if (age <= 50) {
        return 1.3;
      } else if (age <= 70) {
        return 1.5;
      } else {
        return 1.5;
      }
    } else {
      if (age <= 1) {
        return 0.5;
      } else if (age <= 3) {
        return 0.5;
      } else if (age <= 8) {
        return 0.6;
      } else if (age <= 13) {
        return 1;
      } else if (age <= 18) {
        return 1.3;
      } else if (age <= 30) {
        return 1.3;
      } else if (age <= 50) {
        return 1.3;
      } else if (age <= 70) {
        return 1.7;
      } else {
        return 1.7;
      }
    }
  }

  private _calculateRiboflavinDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 1.6;
      } else {
        return 1.6;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 1.4;
      } else {
        return 1.4;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 0.5;
      } else if (age <= 3) {
        return 0.5;
      } else if (age <= 8) {
        return 0.6;
      } else if (age <= 13) {
        return 0.9;
      } else if (age <= 18) {
        return 1;
      } else if (age <= 30) {
        return 1.1;
      } else if (age <= 50) {
        return 1.1;
      } else if (age <= 70) {
        return 1.1;
      } else {
        return 1.1;
      }
    } else {
      if (age <= 1) {
        return 0.5;
      } else if (age <= 3) {
        return 0.5;
      } else if (age <= 8) {
        return 0.6;
      } else if (age <= 13) {
        return 0.9;
      } else if (age <= 18) {
        return 1.3;
      } else if (age <= 30) {
        return 1.3;
      } else if (age <= 50) {
        return 1.3;
      } else if (age <= 70) {
        return 1.3;
      } else {
        return 1.3;
      }
    }
  }

  private _calculateSeleniumDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 70;
      } else {
        return 70;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 60;
      } else {
        return 60;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 20;
      } else if (age <= 3) {
        return 20;
      } else if (age <= 8) {
        return 30;
      } else if (age <= 13) {
        return 40;
      } else if (age <= 18) {
        return 55;
      } else if (age <= 30) {
        return 55;
      } else if (age <= 50) {
        return 55;
      } else if (age <= 70) {
        return 55;
      } else {
        return 55;
      }
    } else {
      if (age <= 1) {
        return 20;
      } else if (age <= 3) {
        return 20;
      } else if (age <= 8) {
        return 30;
      } else if (age <= 13) {
        return 40;
      } else if (age <= 18) {
        return 55;
      } else if (age <= 30) {
        return 55;
      } else if (age <= 50) {
        return 55;
      } else if (age <= 70) {
        return 55;
      } else {
        return 55;
      }
    }
  }

  private _calculateSodiumDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 1500;
      } else {
        return 1500;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 1500;
      } else {
        return 1500;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 370;
      } else if (age <= 3) {
        return 1000;
      } else if (age <= 8) {
        return 1200;
      } else if (age <= 13) {
        return 1500;
      } else if (age <= 18) {
        return 1500;
      } else if (age <= 30) {
        return 1500;
      } else if (age <= 50) {
        return 1500;
      } else if (age <= 70) {
        return 1300;
      } else {
        return 1200;
      }
    } else {
      if (age <= 1) {
        return 370;
      } else if (age <= 3) {
        return 1000;
      } else if (age <= 8) {
        return 1200;
      } else if (age <= 13) {
        return 1500;
      } else if (age <= 18) {
        return 1500;
      } else if (age <= 30) {
        return 1500;
      } else if (age <= 50) {
        return 1500;
      } else if (age <= 70) {
        return 1300;
      } else {
        return 1200;
      }
    }
  }

  private _calculateSugarsDailyRequirements(energyConsumption: number): number {
    return 0.1 * energyConsumption / 4;
  }

  private _calculateThiamineDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 1.4;
      } else {
        return 1.4;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 1.4;
      } else {
        return 1.4;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 0.5;
      } else if (age <= 3) {
        return 0.5;
      } else if (age <= 8) {
        return 0.6;
      } else if (age <= 13) {
        return 0.9;
      } else if (age <= 18) {
        return 1;
      } else if (age <= 30) {
        return 1.1;
      } else if (age <= 50) {
        return 1.1;
      } else if (age <= 70) {
        return 1.1;
      } else {
        return 1.1;
      }
    } else {
      if (age <= 1) {
        return 0.5;
      } else if (age <= 3) {
        return 0.5;
      } else if (age <= 8) {
        return 0.6;
      } else if (age <= 13) {
        return 0.9;
      } else if (age <= 18) {
        return 1.2;
      } else if (age <= 30) {
        return 1.2;
      } else if (age <= 50) {
        return 1.2;
      } else if (age <= 70) {
        return 1.2;
      } else {
        return 1.2;
      }
    }
  }

  private _calculateThreonineDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (lactating) {
      if (age <= 18) {
        return 0.03 * weight;
      } else {
        return 0.03 * weight;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 0.026 * weight;
      } else {
        return 0.026 * weight;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 0.049 * weight;
      } else if (age <= 3) {
        return 0.032 * weight;
      } else if (age <= 8) {
        return 0.024 * weight;
      } else if (age <= 13) {
        return 0.022 * weight;
      } else if (age <= 18) {
        return 0.021 * weight;
      } else if (age <= 30) {
        return 0.02 * weight;
      } else if (age <= 50) {
        return 0.02 * weight;
      } else if (age <= 70) {
        return 0.02 * weight;
      } else {
        return 0.02 * weight;
      }
    } else {
      if (age <= 1) {
        return 0.049 * weight;
      } else if (age <= 3) {
        return 0.032 * weight;
      } else if (age <= 8) {
        return 0.024 * weight;
      } else if (age <= 13) {
        return 0.024 * weight;
      } else if (age <= 18) {
        return 0.022 * weight;
      } else if (age <= 30) {
        return 0.02 * weight;
      } else if (age <= 50) {
        return 0.02 * weight;
      } else if (age <= 70) {
        return 0.02 * weight;
      } else {
        return 0.02 * weight;
      }
    }
  }

  private _calculateTransFatDailyRequirements(): number {
    return 1;
  }

  private _calculateTryptophanDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (lactating) {
      if (age <= 18) {
        return 0.009 * weight;
      } else {
        return 0.009 * weight;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 0.007 * weight;
      } else {
        return 0.007 * weight;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 0.013 * weight;
      } else if (age <= 3) {
        return 0.008 * weight;
      } else if (age <= 8) {
        return 0.006 * weight;
      } else if (age <= 13) {
        return 0.006 * weight;
      } else if (age <= 18) {
        return 0.005 * weight;
      } else if (age <= 30) {
        return 0.005 * weight;
      } else if (age <= 50) {
        return 0.005 * weight;
      } else if (age <= 70) {
        return 0.005 * weight;
      } else {
        return 0.005 * weight;
      }
    } else {
      if (age <= 1) {
        return 0.013 * weight;
      } else if (age <= 3) {
        return 0.008 * weight;
      } else if (age <= 8) {
        return 0.006 * weight;
      } else if (age <= 13) {
        return 0.006 * weight;
      } else if (age <= 18) {
        return 0.006 * weight;
      } else if (age <= 30) {
        return 0.005 * weight;
      } else if (age <= 50) {
        return 0.005 * weight;
      } else if (age <= 70) {
        return 0.005 * weight;
      } else {
        return 0.005 * weight;
      }
    }
  }

  private _calculateValineDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
    if (lactating) {
      if (age <= 18) {
        return 0.035 * weight;
      } else {
        return 0.035 * weight;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 0.031 * weight;
      } else {
        return 0.031 * weight;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 0.058 * weight;
      } else if (age <= 3) {
        return 0.037 * weight;
      } else if (age <= 8) {
        return 0.028 * weight;
      } else if (age <= 13) {
        return 0.027 * weight;
      } else if (age <= 18) {
        return 0.024 * weight;
      } else if (age <= 30) {
        return 0.024 * weight;
      } else if (age <= 50) {
        return 0.024 * weight;
      } else if (age <= 70) {
        return 0.024 * weight;
      } else {
        return 0.024 * weight;
      }
    } else {
      if (age <= 1) {
        return 0.058 * weight;
      } else if (age <= 3) {
        return 0.037 * weight;
      } else if (age <= 8) {
        return 0.028 * weight;
      } else if (age <= 13) {
        return 0.028 * weight;
      } else if (age <= 18) {
        return 0.027 * weight;
      } else if (age <= 30) {
        return 0.024 * weight;
      } else if (age <= 50) {
        return 0.024 * weight;
      } else if (age <= 70) {
        return 0.024 * weight;
      } else {
        return 0.024 * weight;
      }
    }
  }

  private _calculateVitaminADailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 1200;
      } else {
        return 1300;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 750;
      } else {
        return 770;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 300;
      } else if (age <= 3) {
        return 300;
      } else if (age <= 8) {
        return 400;
      } else if (age <= 13) {
        return 600;
      } else if (age <= 18) {
        return 700;
      } else if (age <= 30) {
        return 700;
      } else if (age <= 50) {
        return 700;
      } else if (age <= 70) {
        return 700;
      } else {
        return 700;
      }
    } else {
      if (age <= 1) {
        return 300;
      } else if (age <= 3) {
        return 300;
      } else if (age <= 8) {
        return 400;
      } else if (age <= 13) {
        return 600;
      } else if (age <= 18) {
        return 900;
      } else if (age <= 30) {
        return 900;
      } else if (age <= 50) {
        return 900;
      } else if (age <= 70) {
        return 900;
      } else {
        return 900;
      }
    }
  }

  private _calculateVitaminCDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 115;
      } else {
        return 120;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 80;
      } else {
        return 85;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 15;
      } else if (age <= 3) {
        return 15;
      } else if (age <= 8) {
        return 25;
      } else if (age <= 13) {
        return 45;
      } else if (age <= 18) {
        return 65;
      } else if (age <= 30) {
        return 75;
      } else if (age <= 50) {
        return 75;
      } else if (age <= 70) {
        return 75;
      } else {
        return 75;
      }
    } else {
      if (age <= 1) {
        return 15;
      } else if (age <= 3) {
        return 15;
      } else if (age <= 8) {
        return 25;
      } else if (age <= 13) {
        return 45;
      } else if (age <= 18) {
        return 75;
      } else if (age <= 30) {
        return 90;
      } else if (age <= 50) {
        return 90;
      } else if (age <= 70) {
        return 90;
      } else {
        return 90;
      }
    }
  }

  /**
   * Ideally, the body is able to create 10.000-20.000 IU/30 min sun exposure (1 IU = 0.025 ug)
   * The ability decreases with climate/weather, skin pigmentation, age, and weight
   * http://health.howstuffworks.com/wellness/food-nutrition/vitamin-supplements/how-much-vitamin-d-from-sun1.htm
   */
  private _calculateVitaminDDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 5;
      } else {
        return 5;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 5;
      } else {
        return 5;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 5;
      } else if (age <= 3) {
        return 5;
      } else if (age <= 8) {
        return 5;
      } else if (age <= 13) {
        return 5;
      } else if (age <= 18) {
        return 5;
      } else if (age <= 30) {
        return 5;
      } else if (age <= 50) {
        return 5;
      } else if (age <= 70) {
        return 10;
      } else {
        return 15;
      }
    } else {
      if (age <= 1) {
        return 5;
      } else if (age <= 3) {
        return 5;
      } else if (age <= 8) {
        return 5;
      } else if (age <= 13) {
        return 5;
      } else if (age <= 18) {
        return 5;
      } else if (age <= 30) {
        return 5;
      } else if (age <= 50) {
        return 5;
      } else if (age <= 70) {
        return 10;
      } else {
        return 15;
      }
    }
  }

  private _calculateVitaminEDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 19;
      } else {
        return 19;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 15;
      } else {
        return 15;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 6;
      } else if (age <= 3) {
        return 6;
      } else if (age <= 8) {
        return 7;
      } else if (age <= 13) {
        return 11;
      } else if (age <= 18) {
        return 15;
      } else if (age <= 30) {
        return 15;
      } else if (age <= 50) {
        return 15;
      } else if (age <= 70) {
        return 15;
      } else {
        return 15;
      }
    } else {
      if (age <= 1) {
        return 6;
      } else if (age <= 3) {
        return 6;
      } else if (age <= 8) {
        return 7;
      } else if (age <= 13) {
        return 11;
      } else if (age <= 18) {
        return 15;
      } else if (age <= 30) {
        return 15;
      } else if (age <= 50) {
        return 15;
      } else if (age <= 70) {
        return 15;
      } else {
        return 15;
      }
    }
  }

  private _calculateVitaminKDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 75;
      } else {
        return 90;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 75;
      } else {
        return 90;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 2.5;
      } else if (age <= 3) {
        return 30;
      } else if (age <= 8) {
        return 55;
      } else if (age <= 13) {
        return 60;
      } else if (age <= 18) {
        return 75;
      } else if (age <= 30) {
        return 90;
      } else if (age <= 50) {
        return 90;
      } else if (age <= 70) {
        return 90;
      } else {
        return 90;
      }
    } else {
      if (age <= 1) {
        return 2.5;
      } else if (age <= 3) {
        return 30;
      } else if (age <= 8) {
        return 55;
      } else if (age <= 13) {
        return 60;
      } else if (age <= 18) {
        return 75;
      } else if (age <= 30) {
        return 120;
      } else if (age <= 50) {
        return 120;
      } else if (age <= 70) {
        return 120;
      } else {
        return 120;
      }
    }
  }

  private _calculateWater(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 3800;
      } else {
        return 3800;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 3000;
      } else {
        return 3000;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 800;
      } else if (age <= 3) {
        return 1300;
      } else if (age <= 8) {
        return 1700;
      } else if (age <= 13) {
        return 2100;
      } else if (age <= 18) {
        return 2300;
      } else if (age <= 30) {
        return 2700;
      } else if (age <= 50) {
        return 2700;
      } else if (age <= 70) {
        return 2700;
      } else {
        return 2700;
      }
    } else {
      if (age <= 1) {
        return 800;
      } else if (age <= 3) {
        return 1300;
      } else if (age <= 8) {
        return 1700;
      } else if (age <= 13) {
        return 2400;
      } else if (age <= 18) {
        return 3300;
      } else if (age <= 30) {
        return 3700;
      } else if (age <= 50) {
        return 3700;
      } else if (age <= 70) {
        return 3700;
      } else {
        return 3700;
      }
    }
  }

  private _calculateZincDailyRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      if (age <= 18) {
        return 13;
      } else {
        return 12;
      }
    } else if (pregnant) {
      if (age <= 18) {
        return 12;
      } else {
        return 11;
      }
    } else if (gender === 'female') {
      if (age <= 1) {
        return 3;
      } else if (age <= 3) {
        return 3;
      } else if (age <= 8) {
        return 5;
      } else if (age <= 13) {
        return 8;
      } else if (age <= 18) {
        return 9;
      } else if (age <= 30) {
        return 8;
      } else if (age <= 50) {
        return 8;
      } else if (age <= 70) {
        return 8;
      } else {
        return 8;
      }
    } else {
      if (age <= 1) {
        return 3;
      } else if (age <= 3) {
        return 3;
      } else if (age <= 8) {
        return 5;
      } else if (age <= 13) {
        return 8;
      } else if (age <= 18) {
        return 11;
      } else if (age <= 30) {
        return 11;
      } else if (age <= 50) {
        return 11;
      } else if (age <= 70) {
        return 11;
      } else {
        return 11;
      }
    }
  }

  public calculateDailyRequirements(authId: string, age: number, bmr: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): Promise<Nutrition> {
    return new Promise((resolve, reject) => {
      const subscription: Subscription = this._activityPvd.getEnergyConsumption$(authId).subscribe((energyConsumption: number) => {
        energyConsumption = energyConsumption['$value'] === null ? 0 : energyConsumption['$value'];
        const requirements: Nutrition = new Nutrition();
        requirements.ala.value = this._calculateALADailyRequirements(energyConsumption + bmr);
        requirements.alcohol.value = this._calculateAlcoholDailyRequirements(age);
        requirements.caffeine.value = this._calculateCaffeine(age);
        requirements.calcium.value = this._calculateCalciumDailyRequirements(age, gender, lactating, pregnant);
        requirements.carbs.value = this._calculateCarbDailyRequirements(energyConsumption + bmr);
        requirements.choline.value = this._calculateCholineDailyRequirements(age, gender, lactating, pregnant);
        requirements.copper.value = this._calculateCopperDailyRequirements(age, gender, lactating, pregnant);
        requirements.dha.value = this._calculateDHADailyRequirements(energyConsumption + bmr);
        requirements.energy.value = energyConsumption + bmr;
        requirements.epa.value = this._calculateEPADailyRequirements(energyConsumption + bmr);
        requirements.fats.value = this._calculateFatDailyRequirements(energyConsumption + bmr);
        requirements.fiber.value = this._calculateFiberDailyRequirements(age, gender, lactating, pregnant);
        requirements.histidine.value = this._calculateHistidineDailyRequirements(age, gender, lactating, pregnant, weight);
        requirements.iron.value = this._calculateIronDailyRequirements(age, gender, lactating, pregnant);
        requirements.isoleucine.value = this._calculateIsoleucineDailyRequirements(age, gender, lactating, pregnant, weight);
        requirements.la.value = this._calculateLADailyRequirements(energyConsumption + bmr);
        requirements.leucine.value = this._calculateLeucineDailyRequirements(age, gender, lactating, pregnant, weight);
        requirements.lysine.value = this._calculateLysineDailyRequirements(age, gender, lactating, pregnant, weight);
        requirements.magnesium.value = this._calculateMagnesiumDailyRequirements(age, gender, lactating, pregnant);
        requirements.manganese.value = this._calculateManganeseDailyRequirements(age, gender, lactating, pregnant);
        requirements.methionine.value = this._calculateMethionineDailyRequirements(age, gender, lactating, pregnant, weight);
        requirements.phenylalanine.value = this._calculatePhenylalanineDailyRequirements(age, gender, lactating, pregnant, weight);
        requirements.phosphorus.value = this._calculatePhosphorusDailyRequirements(age, gender, lactating, pregnant);
        requirements.potassium.value = this._calculatePotassiumDailyRequirements(age, gender, lactating, pregnant);
        requirements.protein.value = this._calculateProteinDailyRequirements(energyConsumption + bmr);
        requirements.selenium.value = this._calculateSeleniumDailyRequirements(age, gender, lactating, pregnant);
        requirements.sodium.value = this._calculateSodiumDailyRequirements(age, gender, lactating, pregnant);
        requirements.sugars.value = this._calculateSugarsDailyRequirements(energyConsumption + bmr);
        requirements.threonine.value = this._calculateThreonineDailyRequirements(age, gender, lactating, pregnant, weight);
        requirements.transFat.value = this._calculateTransFatDailyRequirements();
        requirements.tryptophan.value = this._calculateTryptophanDailyRequirements(age, gender, lactating, pregnant, weight);
        requirements.valine.value = this._calculateValineDailyRequirements(age, gender, lactating, pregnant, weight);
        requirements.vitaminA.value = this._calculateVitaminADailyRequirements(age, gender, lactating, pregnant);
        requirements.vitaminB1.value = this._calculateThiamineDailyRequirements(age, gender, lactating, pregnant);
        requirements.vitaminB2.value = this._calculateRiboflavinDailyRequirements(age, gender, lactating, pregnant);
        requirements.vitaminB3.value = this._calculateNiacinDailyRequirements(age, gender, lactating, pregnant);
        requirements.vitaminB5.value = this._calculatePantothenicAcidDailyRequirements(age, gender, lactating, pregnant);
        requirements.vitaminB6.value = this._calculatePyridoxineDailyRequirements(age, gender, lactating, pregnant);
        requirements.vitaminB9.value = this._calculateFolicAcidDailyRequirements(age, gender, lactating, pregnant);
        requirements.vitaminB12.value = this._calculateCobalaminDailyRequirements(age, gender, lactating, pregnant);
        requirements.vitaminC.value = this._calculateVitaminCDailyRequirements(age, gender, lactating, pregnant);
        requirements.vitaminD.value = this._calculateVitaminDDailyRequirements(age, gender, lactating, pregnant);
        requirements.vitaminE.value = this._calculateVitaminEDailyRequirements(age, gender, lactating, pregnant);
        requirements.vitaminK.value = this._calculateVitaminKDailyRequirements(age, gender, lactating, pregnant);
        requirements.water.value = this._calculateWater(age, gender, lactating, pregnant);
        requirements.zinc.value = this._calculateZincDailyRequirements(age, gender, lactating, pregnant);
        this.saveDailyRequirements(authId, requirements).then(() => {
          resolve(requirements);
          subscription.unsubscribe();
        }).catch((err: firebase.FirebaseError) => reject(err));
      },
        (err: firebase.FirebaseError) => reject(err))
    });
  }

  public getDailyRequirements(authId: string, custom?: boolean): Promise<Nutrition> {
    return new Promise((resolve, reject) => {
      let dailyRequirementsSubscription: Subscription = this._db.object(`/daily-requirements/${authId}/custom`).subscribe((customRequirements: Nutrition) => {
        dailyRequirementsSubscription.unsubscribe();
        if (customRequirements['$value'] === null) {
          if (!custom) {
            dailyRequirementsSubscription = this._db.object(`/daily-requirements/${authId}/${CURRENT_DAY}`).subscribe((dailyRequirements: Nutrition) => {
              dailyRequirementsSubscription.unsubscribe();
              if (dailyRequirements['$value'] === null) {
                const fitnessSubscription: Subscription = this._db.object(`/fitness/${authId}`).subscribe((fitness: Fitness) => {
                  fitnessSubscription.unsubscribe();
                  if (fitness['$value'] !== null) {
                    this.calculateDailyRequirements(authId, fitness.age, fitness.bmr, fitness.gender, fitness.lactating, fitness.pregnant, fitness.weight)
                      .then((dailyRequirements: Nutrition) => resolve(dailyRequirements))
                      .catch((err: firebase.FirebaseError) => reject(err));
                  }
                }, (err: firebase.FirebaseError) => reject(err));
              } else {
                resolve(dailyRequirements);
              }
            }, (err: firebase.FirebaseError) => reject(err));
          } else {
            resolve(new Nutrition());
          }
        } else {
          resolve(customRequirements);
        }
      }, (err: firebase.FirebaseError) => reject(err));
    });
  }

  public saveDailyRequirements(authId: string, dailyRequirements: Nutrition, custom?: boolean): firebase.Promise<void> {
    if (custom) {
      return this._db.object(`/daily-requirements/${authId}/custom`).set(dailyRequirements);
    } else {
      return this._db.object(`/daily-requirements/${authId}/${CURRENT_DAY}`).set(dailyRequirements);
    }
  }
}
