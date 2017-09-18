// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import { Storage } from '@ionic/storage';

// Firebase
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { ActivityPlan, Nutrition } from '../../models';

// Providers
import { ActivityProvider } from '../activity/activity';

@Injectable()
export class NutritionProvider {

  constructor(
    private _activityPvd: ActivityProvider,
    private _storage: Storage
  ) { }

  private _calculateALADRI(energyConsumption: number): number {
    return 0.005 * energyConsumption / 9;
  }

  private _calculateAlcoholDRI(age: number): number {
    return age > 18 ? 10 : 0;
  }

  private _calculateBiotinDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateCaffeine(age: number): number {
    return age > 14 ? 300 : 0;
  }

  private _calculateCalciumDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateCarbDRI(energyConsumption: number): number {
    return 0.45 * energyConsumption / 4;
  }

  private _calculateChlorideDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateCholineDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateChromiumDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateCobalaminDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateCopperDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateDHADRI(energyConsumption: number): number {
    return 0.0025 * energyConsumption / 9;
  }

  private _calculateEPADRI(energyConsumption: number): number {
    return 0.0025 * energyConsumption / 9;
  }

  private _calculateFatDRI(energyConsumption: number): number {
    return 0.3 * energyConsumption / 9;
  }

  private _calculateFiberDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateFolicAcidDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateHistidineDRI(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateIodineDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateIronDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateIsoleucineDRI(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateLADRI(energyConsumption: number): number {
    return 0.005 * energyConsumption / 9;
  }

  private _calculateLeucineDRI(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateLysineDRI(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateMagnesiumDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateManganeseDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateMethionineDRI(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateMolybdenumDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateNiacinDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculatePantothenicAcidDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculatePhenylalanineDRI(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculatePhosphorusDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculatePotassiumDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateProteinDRI(energyConsumption: number): number {
    return 0.25 * energyConsumption / 4;
  }

  private _calculatePyridoxineDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateRiboflavinDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateSeleniumDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateSodiumDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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
        return 1.5;
      } else if (age <= 50) {
        return 1500;
      } else if (age <= 70) {
        return 1300;
      } else {
        return 1200;
      }
    }
  }

  private _calculateSugarsDRI(energyConsumption: number): number {
    return 0.1 * energyConsumption / 4;
  }

  private _calculateThiamineDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateThreonineDRI(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateTransFatDRI(): number {
    return 1;
  }

  private _calculateTryptophanDRI(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateValineDRI(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateVitaminADRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateVitaminCDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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
  private _calculateVitaminDDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateVitaminEDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateVitaminKDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateZincDRI(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  public calculateDRI(authId: string, age: number, bmr: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): Promise<Nutrition> {
    return new Promise((resolve, reject) => {
      const currentDay: number = moment().dayOfYear();
      this._storage.ready().then((storage: LocalForage) => {
        this._storage.get(`energyConsumption-${currentDay}`).then((energyOuptut: number) => {
          if (!energyOuptut) {
            const subscription: Subscription = this._activityPvd.getActivityPlan$(authId).subscribe((activityPlan: ActivityPlan) => {
              if (activityPlan['$value'] === null) {
                energyOuptut = 0;
              } else {
                energyOuptut = activityPlan.totalEnergyConsumption;
                this._storage.set(`energyConsumption-${currentDay}`, energyOuptut)
                .catch((err: Error) => reject(err));
              }
              const requirements: Nutrition = new Nutrition();
              requirements.ala.value = this._calculateALADRI(energyOuptut + bmr);
              requirements.alcohol.value = this._calculateAlcoholDRI(age);
              requirements.caffeine.value = this._calculateCaffeine(age);
              requirements.calcium.value = this._calculateCalciumDRI(age, gender, lactating, pregnant);
              requirements.carbs.value = this._calculateCarbDRI(energyOuptut + bmr);
              requirements.choline.value = this._calculateCholineDRI(age, gender, lactating, pregnant);
              requirements.copper.value = this._calculateCopperDRI(age, gender, lactating, pregnant);
              requirements.dha.value = this._calculateDHADRI(energyOuptut + bmr);
              requirements.energy.value = energyOuptut + bmr;
              requirements.epa.value = this._calculateEPADRI(energyOuptut + bmr);
              requirements.fats.value = this._calculateFatDRI(energyOuptut + bmr);
              requirements.fiber.value = this._calculateFiberDRI(age, gender, lactating, pregnant);
              requirements.histidine.value = this._calculateHistidineDRI(age, gender, lactating, pregnant, weight);
              requirements.iron.value = this._calculateIronDRI(age, gender, lactating, pregnant);
              requirements.isoleucine.value = this._calculateIsoleucineDRI(age, gender, lactating, pregnant, weight);
              requirements.la.value = this._calculateLADRI(energyOuptut + bmr);
              requirements.leucine.value = this._calculateLeucineDRI(age, gender, lactating, pregnant, weight);
              requirements.lysine.value = this._calculateLysineDRI(age, gender, lactating, pregnant, weight);
              requirements.magnesium.value = this._calculateMagnesiumDRI(age, gender, lactating, pregnant);
              requirements.manganese.value = this._calculateManganeseDRI(age, gender, lactating, pregnant);
              requirements.methionine.value = this._calculateMethionineDRI(age, gender, lactating, pregnant, weight);
              requirements.phenylalanine.value = this._calculatePhenylalanineDRI(age, gender, lactating, pregnant, weight);
              requirements.phosphorus.value = this._calculatePhosphorusDRI(age, gender, lactating, pregnant);
              requirements.potassium.value = this._calculatePotassiumDRI(age, gender, lactating, pregnant);
              requirements.protein.value = this._calculateProteinDRI(energyOuptut + bmr);
              requirements.selenium.value = this._calculateSeleniumDRI(age, gender, lactating, pregnant);
              requirements.sodium.value = this._calculateSodiumDRI(age, gender, lactating, pregnant);
              requirements.sugars.value = this._calculateSugarsDRI(energyOuptut + bmr);
              requirements.threonine.value = this._calculateThreonineDRI(age, gender, lactating, pregnant, weight);
              requirements.transFat.value = this._calculateTransFatDRI();
              requirements.tryptophan.value = this._calculateTryptophanDRI(age, gender, lactating, pregnant, weight);
              requirements.valine.value = this._calculateValineDRI(age, gender, lactating, pregnant, weight);
              requirements.vitaminA.value = this._calculateVitaminADRI(age, gender, lactating, pregnant);
              requirements.vitaminB1.value = this._calculateThiamineDRI(age, gender, lactating, pregnant);
              requirements.vitaminB2.value = this._calculateRiboflavinDRI(age, gender, lactating, pregnant);
              requirements.vitaminB3.value = this._calculateNiacinDRI(age, gender, lactating, pregnant);
              requirements.vitaminB5.value = this._calculatePantothenicAcidDRI(age, gender, lactating, pregnant);
              requirements.vitaminB6.value = this._calculateRiboflavinDRI(age, gender, lactating, pregnant);
              requirements.vitaminB9.value = this._calculateFolicAcidDRI(age, gender, lactating, pregnant);
              requirements.vitaminB12.value = this._calculateCobalaminDRI(age, gender, lactating, pregnant);
              requirements.vitaminC.value = this._calculateVitaminCDRI(age, gender, lactating, pregnant);
              requirements.vitaminD.value = this._calculateVitaminDDRI(age, gender, lactating, pregnant);
              requirements.vitaminE.value = this._calculateVitaminEDRI(age, gender, lactating, pregnant);
              requirements.vitaminK.value = this._calculateVitaminKDRI(age, gender, lactating, pregnant);
              requirements.water.value = this._calculateWater(age, gender, lactating, pregnant);
              requirements.zinc.value = this._calculateZincDRI(age, gender, lactating, pregnant);
              resolve(requirements);
              subscription.unsubscribe();
            },
              (err: firebase.FirebaseError) => reject(err.message))
          }
        }).catch((err: Error) => reject(err));
      }).catch((err: Error) => reject(err));
    });
  }
}
