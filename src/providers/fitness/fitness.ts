// Angular
import { Injectable } from '@angular/core';

// Models
import { BodyFat, HeartRate } from '../../models';

@Injectable()
export class FitnessProvider {
  constructor() { }

  /**
   * Nes, B.M, et al. HRMax formula
   */
  private calculateHRMax(age: number): number {
    return Math.round(211 - (0.64 * age));
  }

  private calculateFatPercentage(age: number, gender: string, height: number, hips: number, iliac: number, waist: number, weight: number): number {
    if (gender === 'male') {
      return (0.57914807 * waist) + (0.25189114 * hips) + (0.21366088 * iliac) - (0.35595404 * weight * 2.20462262 * 0.4535923704) - 47.371817
    } else if (gender === 'female') {
      return (495 / (1.168297 - (0.002824 * waist) + (0.0000122098 * Math.pow(waist, 2)) - (0.000733128 * hips) + (0.000510477 * height) - (0.000216161 * age))) - 450;
    }
  }

  /**
   * The U.S. Navy Body fat percentage formula
   */
  private calculateFatPercentageUSNavy(age: number, gender: string, height: number, hips: number, neck: number, waist: number, weight: number): number {
    if (gender === 'male') {
      return +(495 / (1.0324 - 0.19077 * Math.log10(Math.abs(waist - neck)) + 0.15456 * Math.log10(height)) - 450).toFixed(2);
    } else if (gender === 'female') {
      return +(495 / (1.29579 - 0.35004 * Math.log10(Math.abs(waist + hips - neck)) + 0.221 * Math.log10(height)) - 450).toFixed(2);
    }
  }

  /**
   * The Revised Harris-Benedict Equation
   */
  public calculateBmr(age: number, gender: string, height: number, weight: number): number {
    if (gender === 'male') {
      return Math.round(13.397 * weight + 4.799 * height - 5.677 * age + 88.362);
    } else {
      return Math.round(9.247 * weight + 3.098 * height - 4.33 * age + 447.593);
    }
  }

  public calculateBodyFat(age: number, gender: string, height: number, hips: number, iliac: number, waist: number, weight: number): BodyFat {
    const bodyFat: number = this.calculateFatPercentage(age, gender, height, hips, iliac, waist, weight);;
    const fatMass: number = +(bodyFat / 100 * +weight).toFixed(2);
    const muscleMass: number = weight - fatMass;
    let idealBodyFat: number;
    if (gender === 'male') {
      if (age <= 20) {
        idealBodyFat = 8.5;
      } else if (age <= 25) {
        idealBodyFat = 10.5;
      } else if (age <= 30) {
        idealBodyFat = 12.7;
      } else if (age <= 35) {
        idealBodyFat = 13.7;
      } else if (age <= 40) {
        idealBodyFat = 15.3;
      } else if (age <= 45) {
        idealBodyFat = 16.4;
      } else if (age <= 50) {
        idealBodyFat = 18.9;
      } else if (age <= 55) {
        idealBodyFat = 20.9;
      }
    } else if (gender === 'female') {
      if (age <= 20) {
        idealBodyFat = 17.7;
      } else if (age <= 25) {
        idealBodyFat = 18.4;
      } else if (age <= 30) {
        idealBodyFat = 19.3;
      } else if (age <= 35) {
        idealBodyFat = 21.5;
      } else if (age <= 40) {
        idealBodyFat = 22.2;
      } else if (age <= 45) {
        idealBodyFat = 22.9;
      } else if (age <= 50) {
        idealBodyFat = 25.2;
      } else if (age <= 55) {
        idealBodyFat = 26.3;
      }
    }

    let bodyFatCategory: string;
    if (gender === 'male') {
      if (bodyFat <= 5) {
        bodyFatCategory = 'Essential fat';
      } else if (bodyFat <= 13) {
        bodyFatCategory = 'Athlete';
      } else if (bodyFat <= 17) {
        bodyFatCategory = 'Fitness';
      } else if (bodyFat <= 25) {
        bodyFatCategory = 'Average';
      } else {
        bodyFatCategory = 'Obese';
      }
    } else if (gender === 'female') {
      if (bodyFat <= 13) {
        bodyFatCategory = 'Essential fat';
      } else if (bodyFat <= 20) {
        bodyFatCategory = 'Athlete';
      } else if (bodyFat <= 24) {
        bodyFatCategory = 'Fitness';
      } else if (bodyFat <= 31) {
        bodyFatCategory = 'Average';
      } else {
        bodyFatCategory = 'Obese';
      }
    }

    return new BodyFat(bodyFatCategory, fatMass, bodyFat, idealBodyFat, muscleMass);

  }

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

  /**
   * Based on the waist to height ratio
   */
  public calculateIdealWaist(age: number, gender: string, height: number): string {
    if (age <= 14) {
      return `${Math.floor(height * 0.46)}-${Math.floor(height * 0.51)} cm`;
    } else if (gender === 'male') {
      return `${Math.floor(height * 0.43)}-${Math.floor(height * 0.52)} cm`;
    } else if (gender === 'female') {
      return `${Math.floor(height * 0.42)}-${Math.floor(height * 0.48)} cm`;
    }
  }

  /**
   * The Dr. Devine formula
   */
  public calculateIdealWeight(age: number, gender: string, height: number): string {
    if (gender === 'male') {
      return `${Math.floor(50 + 2.3 * (height * 0.3937008 - 60))} kg`;
    } else if (gender === 'female') {
      return `${Math.floor(45.5 + 2.3 * (height * 0.3937008 - 60))} kg`;
    }
  }

  /**
  * Calculates the heart The Karvonen method
  */
  public calculateHeartRate(age: number, hrRest: number): HeartRate {
    const hrMax: number = this.calculateHRMax(age);
    return new HeartRate(hrMax, Math.round(0.85 * (hrMax - hrRest) + hrRest), Math.round(0.5 * (hrMax - hrRest) + hrRest));
  }
}
