// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Firebase
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Fitness, MacronutrientRatios, Nutrition } from '../../models';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class NutritionProvider {

  constructor(
    private _db: AngularFireDatabase
  ) { }

  private _calculateALARequirements(energyConsumption: number): number {
    return 0.005 * energyConsumption / 9;
  }

  private _calculateAlcoholRequirements(age: number): number {
    return 1;
  }

  /**
   * Redundant for now
  private _calculateBiotinRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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
    return 1;
  }

  private _calculateCalciumRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  /**
   * Redundant for now
  private _calculateChlorideRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateCholineRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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
  private _calculateChromiumRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateCobalaminRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateCopperRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateDHARequirements(energyConsumption: number): number {
    return 0.0025 * energyConsumption / 9;
  }

  private _calculateEPARequirements(energyConsumption: number): number {
    return 0.0025 * energyConsumption / 9;
  }

  private _calculateFiberRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateFolicAcidRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateHistidineRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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
  private _calculateIodineRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateIronRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateIsoleucineRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateLARequirements(energyConsumption: number): number {
    return 0.005 * energyConsumption / 9;
  }

  private _calculateLeucineRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateLysineRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateMagnesiumRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateManganeseRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateMethionineRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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
  private _calculateMolybdenumRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateNiacinRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculatePantothenicAcidRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculatePhenylalanineRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculatePhosphorusRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculatePotassiumRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculatePyridoxineRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateRiboflavinRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateSeleniumRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateSodiumRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateSugarsRequirements(energyConsumption: number, macronutrientRatios: MacronutrientRatios): number {
    return (macronutrientRatios.carbohydrates / 400) * (energyConsumption / 4);
  }

  private _calculateThiamineRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateThreonineRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateTransFatRequirements(): number {
    return 1;
  }

  private _calculateTryptophanRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateValineRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateVitaminARequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateVitaminCRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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
  private _calculateVitaminDRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateVitaminERequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateVitaminKRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateZincRequirements(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  public calculateCarbRequirements(energyConsumption: number, macronutrientRatios: MacronutrientRatios): number {
    return (macronutrientRatios.carbohydrates / 100) * (energyConsumption / 4);
  }

  public calculateFatRequirements(energyConsumption: number, macronutrientRatios: MacronutrientRatios): number {
    return (macronutrientRatios.fats / 100) * (energyConsumption / 9);
  }

  public calculateProteinRequirements(energyConsumption: number, macronutrientRatios: MacronutrientRatios): number {
    return (macronutrientRatios.protein / 100) * (energyConsumption / 4);
  }

  public calculateRequirements(authId: string, age: number, bmr: number, gender: string, lactating: boolean, macronutrientRatios: MacronutrientRatios, pregnant: boolean, weight: number): Promise<Nutrition> {
    return new Promise((resolve, reject) => {
      const subscription: Subscription = this._db.object(`/activity-plan/${authId}/${CURRENT_DAY}/totalEnergyConsumption`).subscribe((energyConsumption: number) => {
        energyConsumption = energyConsumption['$value'] === null ? 0 : energyConsumption['$value'];
        const requirements: Nutrition = new Nutrition();
        requirements.ala.value = this._calculateALARequirements(energyConsumption + bmr);
        requirements.alcohol.value = this._calculateAlcoholRequirements(age);
        requirements.caffeine.value = this._calculateCaffeine(age);
        requirements.calcium.value = this._calculateCalciumRequirements(age, gender, lactating, pregnant);
        requirements.carbs.value = this.calculateCarbRequirements(energyConsumption + bmr, macronutrientRatios);
        requirements.choline.value = this._calculateCholineRequirements(age, gender, lactating, pregnant);
        requirements.copper.value = this._calculateCopperRequirements(age, gender, lactating, pregnant);
        requirements.dha.value = this._calculateDHARequirements(energyConsumption + bmr);
        requirements.energy.value = energyConsumption + bmr;
        requirements.epa.value = this._calculateEPARequirements(energyConsumption + bmr);
        requirements.fats.value = this.calculateFatRequirements(energyConsumption + bmr, macronutrientRatios);
        requirements.fiber.value = this._calculateFiberRequirements(age, gender, lactating, pregnant);
        requirements.histidine.value = this._calculateHistidineRequirements(age, gender, lactating, pregnant, weight);
        requirements.iron.value = this._calculateIronRequirements(age, gender, lactating, pregnant);
        requirements.isoleucine.value = this._calculateIsoleucineRequirements(age, gender, lactating, pregnant, weight);
        requirements.la.value = this._calculateLARequirements(energyConsumption + bmr);
        requirements.leucine.value = this._calculateLeucineRequirements(age, gender, lactating, pregnant, weight);
        requirements.lysine.value = this._calculateLysineRequirements(age, gender, lactating, pregnant, weight);
        requirements.magnesium.value = this._calculateMagnesiumRequirements(age, gender, lactating, pregnant);
        requirements.manganese.value = this._calculateManganeseRequirements(age, gender, lactating, pregnant);
        requirements.methionine.value = this._calculateMethionineRequirements(age, gender, lactating, pregnant, weight);
        requirements.phenylalanine.value = this._calculatePhenylalanineRequirements(age, gender, lactating, pregnant, weight);
        requirements.phosphorus.value = this._calculatePhosphorusRequirements(age, gender, lactating, pregnant);
        requirements.potassium.value = this._calculatePotassiumRequirements(age, gender, lactating, pregnant);
        requirements.protein.value = this.calculateProteinRequirements(energyConsumption + bmr, macronutrientRatios);
        requirements.selenium.value = this._calculateSeleniumRequirements(age, gender, lactating, pregnant);
        requirements.sodium.value = this._calculateSodiumRequirements(age, gender, lactating, pregnant);
        requirements.sugars.value = this._calculateSugarsRequirements(energyConsumption + bmr, macronutrientRatios);
        requirements.threonine.value = this._calculateThreonineRequirements(age, gender, lactating, pregnant, weight);
        requirements.transFat.value = this._calculateTransFatRequirements();
        requirements.tryptophan.value = this._calculateTryptophanRequirements(age, gender, lactating, pregnant, weight);
        requirements.valine.value = this._calculateValineRequirements(age, gender, lactating, pregnant, weight);
        requirements.vitaminA.value = this._calculateVitaminARequirements(age, gender, lactating, pregnant);
        requirements.vitaminB1.value = this._calculateThiamineRequirements(age, gender, lactating, pregnant);
        requirements.vitaminB2.value = this._calculateRiboflavinRequirements(age, gender, lactating, pregnant);
        requirements.vitaminB3.value = this._calculateNiacinRequirements(age, gender, lactating, pregnant);
        requirements.vitaminB5.value = this._calculatePantothenicAcidRequirements(age, gender, lactating, pregnant);
        requirements.vitaminB6.value = this._calculatePyridoxineRequirements(age, gender, lactating, pregnant);
        requirements.vitaminB9.value = this._calculateFolicAcidRequirements(age, gender, lactating, pregnant);
        requirements.vitaminB12.value = this._calculateCobalaminRequirements(age, gender, lactating, pregnant);
        requirements.vitaminC.value = this._calculateVitaminCRequirements(age, gender, lactating, pregnant);
        requirements.vitaminD.value = this._calculateVitaminDRequirements(age, gender, lactating, pregnant);
        requirements.vitaminE.value = this._calculateVitaminERequirements(age, gender, lactating, pregnant);
        requirements.vitaminK.value = this._calculateVitaminKRequirements(age, gender, lactating, pregnant);
        requirements.water.value = this._calculateWater(age, gender, lactating, pregnant);
        requirements.zinc.value = this._calculateZincRequirements(age, gender, lactating, pregnant);
        this.saveRequirements(authId, requirements).then(() => {
          resolve(requirements);
          subscription.unsubscribe();
        }).catch((err: firebase.FirebaseError) => reject(err));
      },
        (err: firebase.FirebaseError) => reject(err))
    });
  }

  public calibrateMacronutrientRatios(macronutrientRatios: MacronutrientRatios, changedMacronutrient: string): MacronutrientRatios {
    const totalReport: number = macronutrientRatios.carbohydrates + macronutrientRatios.fats + macronutrientRatios.protein;
    if (totalReport <= 100) {
      return macronutrientRatios;
    }

    const deviation: number = totalReport - 100;
    if (changedMacronutrient === 'carbohydrates') {
      macronutrientRatios.fats -= deviation / 2;
      macronutrientRatios.protein -= deviation / 2;
    } else if (changedMacronutrient === 'fat') {
      macronutrientRatios.carbohydrates -= deviation / 2;
      macronutrientRatios.protein -= deviation / 2;
    } else {
      macronutrientRatios.carbohydrates -= deviation / 2;
      macronutrientRatios.fats -= deviation / 2;
    }

    if (macronutrientRatios.carbohydrates < 0) {
      macronutrientRatios.carbohydrates = 0;
    }

    if (macronutrientRatios.fats < 0) {
      macronutrientRatios.fats = 0;
    }

    if (macronutrientRatios.protein < 0) {
      macronutrientRatios.protein = 0;
    }

    macronutrientRatios.carbohydrates = Math.round(macronutrientRatios.carbohydrates);
    macronutrientRatios.fats = Math.round(macronutrientRatios.fats);
    macronutrientRatios.protein = Math.round(macronutrientRatios.protein);

    return macronutrientRatios;
  }

  public getRequirements(authId: string, custom?: boolean): Promise<Nutrition> {
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
                    this.calculateRequirements(authId, fitness.age, fitness.bmr, fitness.gender, fitness.lactating, fitness.macronutrientRatios, fitness.pregnant, fitness.weight)
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

  public saveRequirements(authId: string, dailyRequirements: Nutrition, custom?: boolean): Promise<void> {
    if (custom) {
      return this._db.object(`/daily-requirements/${authId}/custom`).set(dailyRequirements);
    } else {
      return this._db.object(`/daily-requirements/${authId}/${CURRENT_DAY}`).set(dailyRequirements);
    }
  }
}
