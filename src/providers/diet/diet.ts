// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Subject } from 'rxjs/Subject';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { FirebaseError } from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Constitution, Diet, Food, Meal, NutritionalValues } from '../../models';

const CURRENT_DAY: string = moment().format('YYYY-MM-DD');

@Injectable()
export class DietProvider {
  private _trendDaysSubject: Subject<any> = new Subject();
  constructor(
    private _db: AngularFireDatabase
  ) { }

  private _calculateAlaRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      return 13;
    } else if (pregnant) {
      return 13;
    } else if (gender === 'female') {
      if (age <= 1) {
        return 4.4;
      } else if (age <= 3) {
        return 4.6;
      } else if (age <= 8) {
        return 7;
      } else if (age <= 13) {
        return 10;
      } else if (age <= 18) {
        return 10;
      } else {
        return 12;
      }
    } else {
      if (age <= 1) {
        return 4.4;
      } else if (age <= 3) {
        return 4.6;
      } else if (age <= 8) {
        return 7;
      } else if (age <= 13) {
        return 10;
      } else if (age <= 18) {
        return 12;
      } else if (age <= 30) {
        return 16;
      } else {
        return 17;
      }
    }
  }

  /**
   * Redundant for now
  private _calculateBiotinRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateCalciumRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateCarbRequirement(energyConsumption: number, intenseExercise: boolean, constitution: string): number {
    switch (constitution) {
      case 'Kapha':
        return (intenseExercise ? 0.3 : 0.2) * energyConsumption / 4;

      case 'Vata':
        return (intenseExercise ? 0.7 : 0.6) * energyConsumption / 4;

      case 'Pitta':
        return (intenseExercise ? 0.5 : 0.4) * energyConsumption / 4;
    }
  }

  /**
   * Redundant for now
  private _calculateChlorideRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateCholineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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
  private _calculateChromiumRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateVitaminB12Requirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateCopperRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateFatRequirement(energyConsumption: number, intenseExercise: boolean, constitution: string): number {
    switch (constitution) {
      case 'Kapha':
        return (intenseExercise ? 0.25 : 0.4) * energyConsumption / 4;

      case 'Vata':
        return (intenseExercise ? 0.1 : 0.25) * energyConsumption / 4;

      case 'Pitta':
        return (intenseExercise ? 0.2 : 0.35) * energyConsumption / 4;
    }
  }

  private _calculateFiberRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateVitaminB9Requirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateHistidineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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
  private _calculateIodineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateIronRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateIsoleucineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateLaRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
    if (lactating) {
      return 13;
    } else if (pregnant) {
      return 13;
    } else if (gender === 'female') {
      if (age <= 1) {
        return 4.4;
      } else if (age <= 3) {
        return 4.6;
      } else if (age <= 8) {
        return 7;
      } else if (age <= 13) {
        return 10;
      } else if (age <= 18) {
        return 10;
      } else {
        return 12;
      }
    } else {
      if (age <= 1) {
        return 4.4;
      } else if (age <= 3) {
        return 4.6;
      } else if (age <= 8) {
        return 7;
      } else if (age <= 13) {
        return 10;
      } else if (age <= 18) {
        return 12;
      } else if (age <= 30) {
        return 16;
      } else {
        return 17;
      }
    }
  }

  private _calculateLeucineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateLysineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateMagnesiumRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateManganeseRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateMethionineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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
  private _calculateMolybdenumRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateVitaminB3Requirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateVitaminB5Requirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculatePhenylalanineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculatePhosphorusRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculatePotassiumRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateProteinRequirement(energyConsumption: number, intenseExercise: boolean, constitution: string): number {
    switch (constitution) {
      case 'Kapha':
        return (intenseExercise ? 0.45 : 0.4) * energyConsumption / 4;

      case 'Vata':
        return (intenseExercise ? 0.2 : 0.15) * energyConsumption / 4;

      case 'Pitta':
        return (intenseExercise ? 0.3 : 0.25) * energyConsumption / 4;
    }
  }

  private _calculateVitaminB6Requirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateVitaminB2Requirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateSeleniumRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateSodiumRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateSugarsRequirement(energyConsumption: number): number {
    return 0.1 * energyConsumption / 4;
  }

  private _calculateVitaminB1Requirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateThreonineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateTransFatRequirement(): number {
    return 0.00000000000000000000000001;
  }

  private _calculateTryptophanRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateValineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private _calculateVitaminARequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateVitaminCRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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
  private _calculateVitaminDRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateVitaminERequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateVitaminKRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private _calculateWater(intenseExercise: boolean, weight: number): number {
    return weight * 28.4 * (intenseExercise ? 1.5 : 1);
  }

  private _calculateZincRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  public calculateNourishment(foods: (Food | Meal)[]): NutritionalValues {
    const nourishment: NutritionalValues = new NutritionalValues();
    foods.forEach((f: Food | Meal) => {
      for (let key in nourishment) {
        if (key in f.nourishment) {
          nourishment[key].value += +f.nourishment[key].value * +f.quantity;
        }
      }
    });

    return nourishment;
  }

  public calculateNourishmentFromRequirement(current: NutritionalValues, required: NutritionalValues): NutritionalValues {
    const nourishment: NutritionalValues = new NutritionalValues();
    for (let key in current) {
      nourishment[key].value = Math.round((current[key].value * 100) / (required[key].value || 1));
    }

    return nourishment;
  }

  public calculateRequirement(
    age: number,
    constitution: Constitution,
    gender: string,
    lactating: boolean,
    pregnant: boolean,
    weight: number
  ): Promise<NutritionalValues> {
    const energyConsumption = 0;
    const intenseExercise = false;
    return new Promise((resolve, rejcet) => {
      resolve(new NutritionalValues(
        energyConsumption,
        this._calculateWater(intenseExercise, weight),
        this._calculateProteinRequirement(energyConsumption, intenseExercise, constitution.dominantDosha),
        this._calculateCarbRequirement(energyConsumption, intenseExercise, constitution.dominantDosha),
        this._calculateFiberRequirement(age, gender, lactating, pregnant),
        this._calculateSugarsRequirement(energyConsumption),
        this._calculateFatRequirement(energyConsumption, intenseExercise, constitution.dominantDosha),
        this._calculateTransFatRequirement(),
        this._calculateAlaRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateLaRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateHistidineRequirement(age, gender, lactating, pregnant, weight) * (intenseExercise ? 3 : 2),
        this._calculateIsoleucineRequirement(age, gender, lactating, pregnant, weight) * (intenseExercise ? 3 : 2),
        this._calculateLeucineRequirement(age, gender, lactating, pregnant, weight) * (intenseExercise ? 3 : 2),
        this._calculateLysineRequirement(age, gender, lactating, pregnant, weight) * (intenseExercise ? 3 : 2),
        this._calculateMethionineRequirement(age, gender, lactating, pregnant, weight) * (intenseExercise ? 3 : 2),
        this._calculatePhenylalanineRequirement(age, gender, lactating, pregnant, weight) * (intenseExercise ? 3 : 2),
        this._calculateThreonineRequirement(age, gender, lactating, pregnant, weight) * (intenseExercise ? 3 : 2),
        this._calculateTryptophanRequirement(age, gender, lactating, pregnant, weight) * (intenseExercise ? 3 : 2),
        this._calculateValineRequirement(age, gender, lactating, pregnant, weight) * (intenseExercise ? 3 : 2),
        this._calculateCalciumRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateCopperRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateIronRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateMagnesiumRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateManganeseRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculatePhosphorusRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculatePotassiumRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateSeleniumRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateSodiumRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateZincRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateVitaminARequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateVitaminB1Requirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateVitaminB2Requirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateVitaminB3Requirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateVitaminB5Requirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateVitaminB6Requirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateVitaminB9Requirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateVitaminB12Requirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateCholineRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateVitaminCRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateVitaminDRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateVitaminERequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2),
        this._calculateVitaminKRequirement(age, gender, lactating, pregnant) * (intenseExercise ? 3 : 2)
      ));
    });
  }

  public changeTrendDays(days: number): void {
    this._trendDaysSubject.next(days);
  }

  public getDiet$(authId: string, date?: string): FirebaseObjectObservable<Diet> {
    return this._db.object(`/${authId}/diet/${date || CURRENT_DAY}`);
  }

  public getFavoriteMeals$(authId: string): FirebaseListObservable<Meal[]> {
    return this._db.list(`/${authId}/meals/`);
  }

  public getTrends$(authId: string, days?: number): FirebaseListObservable<Diet[]> {
    setTimeout(() => {
      this.changeTrendDays(days);
    });
    return this._db.list(`/${authId}/trends/diet/`, {
      query: {
        limitToLast: this._trendDaysSubject
      }
    });
  }

  public removeFavoriteMeal(authId: string, meal: Meal): Promise<void> {
    return this._db.list(`/${authId}/meals/`).remove(meal['$key'])
  }

  public saveFavoriteMeal(authId: string, meal: Meal): Promise<{}> {
    return new Promise((resolve, reject) => {
      if ('$key' in meal) {
        this._db.list(`/${authId}/meals/`).update(meal['$key'], meal).then(() => {
          resolve();
        }).catch((err: FirebaseError) => reject(err));
      } else {
        this._db.list(`/${authId}/meals/`).push(meal).then(() => {
          resolve();
        });
      }
    })
  }

  public saveDiet(authId: string, diet: Diet, trends: Diet[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      if (!!trends.length) {
        trends.reverse();
        if (CURRENT_DAY !== trends[0].date) {
          this._db.list(`/${authId}/trends/diet/`).push(diet);
        } else {
          this._db.list(`/${authId}/trends/diet/`).update(trends[0]['$key'], diet);
        }
      } else {
        this._db.list(`/${authId}/trends/diet/`).push(diet)
      }
      this._db.object(`/${authId}/diet/${diet.date}`).set(diet).then(() => {
        resolve();
      }).catch((err: FirebaseError) => reject(err));
    });
  }

}
