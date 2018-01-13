// Angular
import { Injectable } from '@angular/core';

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
  public calculateBodyFatPercentage(gender: string, height: number, hips: number, neck: number, units: string, waist: number, weight: number): number {
    if (units === 'us') {
      if (gender === 'male') {
        return Math.round(86.01 * Math.log10(+waist - +neck) - 70.041 * Math.log10(height) + 36.76);
      } else {
        return Math.round(0);
      }
    }
  }
}
