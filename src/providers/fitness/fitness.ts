// Angular
import { Injectable } from '@angular/core';

// Models
import { BodyFat } from '../../models';

@Injectable()
export class FitnessProvider {
  constructor() { }

  /**
   * The Revised Harris-Benedict Equation
   */
  public calculateBmr(age: number, gender: string, height: number, weight: number): number {
    if (gender === 'male') {
      return Math.round(13.397 * +weight + 4.799 * +height - 5.677 * +age + 88.362);
    } else {
      return Math.round(9.247 * +weight + 3.098 * +height - 4.33 * +age + 447.593);
    }
  }

  /**
   * The U.S. Navy Body fat percentage formula
   */
  public calculateBodyFatPercentage(age: number, gender: string, height: number, hips: number, neck: number, waist: number, weight: number): BodyFat {
    let bodyFat: number;
    if (gender === 'male') {
      bodyFat = Math.round((495 / 1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450);
    } else if (gender === 'female') {
      bodyFat = Math.round((495 / 1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height)) - 450);
    }

    const fatMass: number = bodyFat * weight;
    const muscleMass: number = weight - fatMass;
    let jpIdealBf: number;
    if (gender === 'male') {
      if (age <= 20) {
        jpIdealBf = 8.5;
      } else if (age <= 25) {
        jpIdealBf = 10.5;
      } else if (age <= 30) {
        jpIdealBf = 12.7;
      } else if (age <= 35) {
        jpIdealBf = 13.7;
      } else if (age <= 40) {
        jpIdealBf = 15.3;
      } else if (age <= 45) {
        jpIdealBf = 16.4;
      } else if (age <= 50) {
        jpIdealBf = 18.9;
      } else if (age <= 55) {
        jpIdealBf = 20.9;
      }
    } else if (gender === 'female') {
      if (age <= 20) {
        jpIdealBf = 17.7;
      } else if (age <= 25) {
        jpIdealBf = 18.4;
      } else if (age <= 30) {
        jpIdealBf = 19.3;
      } else if (age <= 35) {
        jpIdealBf = 21.5;
      } else if (age <= 40) {
        jpIdealBf = 22.2;
      } else if (age <= 45) {
        jpIdealBf = 22.9;
      } else if (age <= 50) {
        jpIdealBf = 25.2;
      } else if (age <= 55) {
        jpIdealBf = 26.3;
      }
    }

    let bodyFatCategory: string;
    if (gender === 'male') {
      if (bodyFat <= 5) {
        bodyFatCategory = 'Essential fat';
      } if (bodyFat <= 13) {
        bodyFatCategory = 'Athlete';
      } if (bodyFat <= 17) {
        bodyFatCategory = 'Fitness';
      } if (bodyFat <= 25) {
        bodyFatCategory = 'Average';
      } else {
        bodyFatCategory = 'Obese';
      }
    } else if (gender === 'female') {
      if (bodyFat <= 13) {
        bodyFatCategory = 'Essential fat';
      } if (bodyFat <= 20) {
        bodyFatCategory = 'Athlete';
      } if (bodyFat <= 24) {
        bodyFatCategory = 'Fitness';
      } if (bodyFat <= 31) {
        bodyFatCategory = 'Average';
      } else {
        bodyFatCategory = 'Obese';
      }
    }

    return new BodyFat(bodyFatCategory, fatMass, bodyFat, muscleMass);

  }

  /**
   * The U.S. Navy Body fat percentage formula
   */
  public calculateBodyShape(chest: number, gender: string, hips: number, waist: number): string {
    const wcRatio: number = waist / chest;
    if (gender === 'male') {
      return wcRatio > 0.8 ? 'Apple shape' : 'V shape';
    } else if (gender === 'female') {
      const whRatio: number = waist / hips;
      const wcwhRatio: number = wcRatio / whRatio;
      if ((wcRatio <= 0.8 && whRatio >= 0.7) || (wcwhRatio <= 1.25 && wcwhRatio >= 0.75)) {
        return 'Hourglass shape'
      } else if (wcRatio > 0.8) {
        return 'Apple shape'
      } else if (whRatio < 0.7) {
        return 'Pear shape';
      }
    }
  }
}
