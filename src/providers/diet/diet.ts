// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { FirebaseError } from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Constitution, Diet, Food, Meal, NutritionalValues, PhysicalActivityLog, Activity } from '../../models';

// Providers
import { PhysicalActivityProvider } from '../physical-activity/physical-activity';

const CURRENT_DAY: string = moment().format('YYYY-MM-DD');

@Injectable()
export class DietProvider {
  private trendDaysSubject: Subject<any> = new Subject();
  constructor(
    private db: AngularFireDatabase,
    private physicalActivityPvd: PhysicalActivityProvider
  ) { }

  private calculateAlaRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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
  private calculateBiotinRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateCalciumRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateCarbRequirement(energyConsumption: number, intensePhysicalActivity: boolean, constitution: string): number {
    switch (constitution) {
      case 'Vata-Pitta-Kapha':
        return (intensePhysicalActivity ? 0.5 : 0.4) * energyConsumption / 4;

      case 'Vata-Pitta':
        return (intensePhysicalActivity ? 0.6 : 0.5) * energyConsumption / 4;

      case 'Pitta-Kapha':
        return (intensePhysicalActivity ? 0.4 : 0.3) * energyConsumption / 4;

      case 'Vata-Kapha':
        return (intensePhysicalActivity ? 0.5 : 0.4) * energyConsumption / 4;

      case 'Kapha':
        return (intensePhysicalActivity ? 0.3 : 0.2) * energyConsumption / 4;

      case 'Vata':
        return (intensePhysicalActivity ? 0.7 : 0.6) * energyConsumption / 4;

      case 'Pitta':
        return (intensePhysicalActivity ? 0.5 : 0.4) * energyConsumption / 4;
    }
  }

  /**
   * Redundant for now
  private calculateChlorideRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateCholineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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
  private calculateChromiumRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateVitaminB12Requirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateCopperRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateFatRequirement(energyConsumption: number, intensePhysicalActivity: boolean, constitution: string): number {
    switch (constitution) {
      case 'Vata-Pitta-Kapha':
        return (intensePhysicalActivity ? 0.18 : 0.33) * energyConsumption / 9;

      case 'Vata-Pitta':
        return (intensePhysicalActivity ? 0.15 : 0.3) * energyConsumption / 9;

      case 'Pitta-Kapha':
        return (intensePhysicalActivity ? 0.22 : 0.37) * energyConsumption / 9;

      case 'Vata-Kapha':
        return (intensePhysicalActivity ? 0.17 : 0.32) * energyConsumption / 9;

      case 'Kapha':
        return (intensePhysicalActivity ? 0.25 : 0.4) * energyConsumption / 9;

      case 'Vata':
        return (intensePhysicalActivity ? 0.1 : 0.25) * energyConsumption / 9;

      case 'Pitta':
        return (intensePhysicalActivity ? 0.2 : 0.35) * energyConsumption / 9;
    }
  }

  private calculateFiberRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateVitaminB9Requirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateHistidineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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
  private calculateIodineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateIronRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateIsoleucineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private calculateLaRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateLeucineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private calculateLysineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private calculateMagnesiumRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateManganeseRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateMethionineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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
  private calculateMolybdenumRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateVitaminB3Requirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateVitaminB5Requirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculatePhenylalanineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private calculatePhosphorusRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculatePotassiumRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateProteinRequirement(energyConsumption: number, intensePhysicalActivity: boolean, constitution: string): number {
    switch (constitution) {
      case 'Vata-Pitta-Kapha':
        return (intensePhysicalActivity ? 0.32 : 0.27) * energyConsumption / 4;

      case 'Vata-Pitta':
        return (intensePhysicalActivity ? 0.25 : 0.2) * energyConsumption / 4;

      case 'Pitta-Kapha':
        return (intensePhysicalActivity ? 0.38 : 0.33) * energyConsumption / 4;

      case 'Vata-Kapha':
        return (intensePhysicalActivity ? 0.33 : 0.28) * energyConsumption / 4;

      case 'Kapha':
        return (intensePhysicalActivity ? 0.45 : 0.4) * energyConsumption / 4;

      case 'Vata':
        return (intensePhysicalActivity ? 0.2 : 0.15) * energyConsumption / 4;

      case 'Pitta':
        return (intensePhysicalActivity ? 0.3 : 0.25) * energyConsumption / 4;
    }
  }

  private calculateVitaminB6Requirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateVitaminB2Requirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateSeleniumRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateSodiumRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateSugarsRequirement(energyConsumption: number, intensePhysicalActivity: boolean, constitution: string): number {
    switch (constitution) {
      case 'Vata-Pitta-Kapha':
        return (intensePhysicalActivity ? 0.25 : 0.2) * energyConsumption / 4;

      case 'Vata-Pitta':
        return (intensePhysicalActivity ? 0.3 : 0.25) * energyConsumption / 4;

      case 'Pitta-Kapha':
        return (intensePhysicalActivity ? 0.2 : 0.15) * energyConsumption / 4;

      case 'Vata-Kapha':
        return (intensePhysicalActivity ? 0.25 : 0.2) * energyConsumption / 4;

      case 'Kapha':
        return (intensePhysicalActivity ? 0.15 : 0.1) * energyConsumption / 4;

      case 'Vata':
        return (intensePhysicalActivity ? 0.35 : 0.3) * energyConsumption / 4;

      case 'Pitta':
        return (intensePhysicalActivity ? 0.25 : 0.2) * energyConsumption / 4;
    }
  }

  private calculateVitaminB1Requirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateThreonineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private calculateTransFatRequirement(): number {
    return 1;
  }

  private calculateTryptophanRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private calculateValineRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean, weight: number): number {
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

  private calculateVitaminARequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateVitaminCRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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
  private calculateVitaminDRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateVitaminERequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateVitaminKRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  private calculateWater(intensePhysicalActivity: boolean, weight: number): number {
    return weight * 28.4 * (intensePhysicalActivity ? 1.5 : 1);
  }

  private calculateZincRequirement(age: number, gender: string, lactating: boolean, pregnant: boolean): number {
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

  public calculateNourishment(foods: (Food | Meal)[], withQuantities?: boolean): NutritionalValues {
    const nourishment: NutritionalValues = new NutritionalValues();
    foods.forEach((f: Food | Meal) => {
      for (let key in nourishment) {
        if (key in f.nourishment) {
          nourishment[key].value += +f.nourishment[key].value * (withQuantities ? +f.quantity / 100 : 1);
        }
      }
    });

    return nourishment;
  }

  public calculateNourishmentFromRequirement(current: NutritionalValues, required: NutritionalValues): NutritionalValues {
    const nourishment: NutritionalValues = new NutritionalValues();
    for (let key in required) {
      nourishment[key].value = Math.round((current[key].value * 100) / required[key].value);
    }

    return nourishment;
  }

  /**
   * What we eat differs from what we absorb and what our cells use
   * Nutritional values are in a constant state of degradation
   * after harvesting/sacrificing (storage, preparation, transportation, light, heat, oxygen, etc.)
   * The majority of foods, in reality, are nutrient deprived because of overproduction and soil mineral depletion
   */
  public calculateRequirement(
    authId: string,
    age: number,
    bmr: number,
    constitution: Constitution,
    gender: string,
    lactating: boolean,
    pregnant: boolean,
    weight: number,
    date?: string
  ): Promise<NutritionalValues> {
    date = date || CURRENT_DAY;
    return new Promise((resolve, reject) => {
      const subscription: Subscription = this.physicalActivityPvd.getPhysicalActivityLog$(authId, date).subscribe(
        (e: PhysicalActivityLog) => {
          let intensePhysicalActivity: boolean = false,
            energyConsumption: number = bmr;
          if (!!e && e['$value'] !== null) {
            e.activities.forEach((a: Activity) => {
              if (a.met > 5) {
                intensePhysicalActivity = true;
              }
            });
            energyConsumption += e.energyBurn;
          }
          subscription.unsubscribe();
          resolve(new NutritionalValues(
            energyConsumption,
            this.calculateWater(intensePhysicalActivity, weight),
            this.calculateProteinRequirement(energyConsumption, intensePhysicalActivity, constitution.dominantDosha),
            this.calculateCarbRequirement(energyConsumption, intensePhysicalActivity, constitution.dominantDosha),
            this.calculateFiberRequirement(age, gender, lactating, pregnant),
            this.calculateSugarsRequirement(energyConsumption, intensePhysicalActivity, constitution.dominantDosha),
            this.calculateFatRequirement(energyConsumption, intensePhysicalActivity, constitution.dominantDosha),
            this.calculateTransFatRequirement(),
            this.calculateAlaRequirement(age, gender, lactating, pregnant),
            this.calculateLaRequirement(age, gender, lactating, pregnant),
            this.calculateHistidineRequirement(age, gender, lactating, pregnant, weight) * (intensePhysicalActivity ? 3 : 2),
            this.calculateIsoleucineRequirement(age, gender, lactating, pregnant, weight) * (intensePhysicalActivity ? 3 : 2),
            this.calculateLeucineRequirement(age, gender, lactating, pregnant, weight) * (intensePhysicalActivity ? 3 : 2),
            this.calculateLysineRequirement(age, gender, lactating, pregnant, weight) * (intensePhysicalActivity ? 3 : 2),
            this.calculateMethionineRequirement(age, gender, lactating, pregnant, weight) * (intensePhysicalActivity ? 3 : 2),
            this.calculatePhenylalanineRequirement(age, gender, lactating, pregnant, weight) * (intensePhysicalActivity ? 3 : 2),
            this.calculateThreonineRequirement(age, gender, lactating, pregnant, weight) * (intensePhysicalActivity ? 3 : 2),
            this.calculateTryptophanRequirement(age, gender, lactating, pregnant, weight) * (intensePhysicalActivity ? 3 : 2),
            this.calculateValineRequirement(age, gender, lactating, pregnant, weight) * (intensePhysicalActivity ? 3 : 2),
            this.calculateCalciumRequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateCopperRequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateIronRequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateMagnesiumRequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateManganeseRequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculatePhosphorusRequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculatePotassiumRequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateSeleniumRequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateSodiumRequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateZincRequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateVitaminARequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateVitaminB1Requirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateVitaminB2Requirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateVitaminB3Requirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateVitaminB5Requirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateVitaminB6Requirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateVitaminB9Requirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateVitaminB12Requirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateCholineRequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateVitaminCRequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateVitaminDRequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateVitaminERequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2),
            this.calculateVitaminKRequirement(age, gender, lactating, pregnant) * (intensePhysicalActivity ? 3 : 2)
          ));
        },
        (err: FirebaseError) => {
          reject(err.message);
        }
      );
    });
  }

  public changeTrendDays(days: number): void {
    this.trendDaysSubject.next(days);
  }

  public getDiet$(authId: string, date?: string): FirebaseObjectObservable<Diet> {
    return this.db.object(`/${authId}/diet/${date || CURRENT_DAY}`);
  }

  public getFavoriteMeals$(authId: string): FirebaseListObservable<Meal[]> {
    return this.db.list(`/${authId}/meals/`);
  }

  public getTrends$(authId: string, days?: number): FirebaseListObservable<Diet[]> {
    setTimeout(() => {
      this.changeTrendDays(days);
    });
    return this.db.list(`/${authId}/trends/diet/`, {
      query: {
        limitToLast: this.trendDaysSubject
      }
    });
  }

  public removeFavoriteMeal(authId: string, meal: Meal): Promise<void> {
    return this.db.list(`/${authId}/meals/`).remove(meal.key)
  }

  public saveFavoriteMeal(authId: string, meal: Meal): Promise<{}> {
    return new Promise((resolve, reject) => {
      if ('key' in meal) {
        this.db.list(`/${authId}/meals/`).update(meal.key, meal).then(() => {
          resolve();
        }).catch((err: FirebaseError) => reject(err));
      } else {
        resolve(this.db.list(`/${authId}/meals/`).push(meal).key);
      }
    })
  }

  public saveDiet(authId: string, diet: Diet, trends: Diet[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      const trend: Diet = trends.find((d: Diet) => d.date === diet.date);
      if (trend) {
        this.db.list(`/${authId}/trends/diet/`).update(trend['$key'], diet);
      } else {
        this.db.list(`/${authId}/trends/diet/`).push(diet);
      }
      this.db.object(`/${authId}/diet/${diet.date}`).set(diet).then(() => {
        resolve();
      }).catch((err: FirebaseError) => reject(err));
    });
  }

}
