import { Injectable } from '@angular/core';

@Injectable()
export class FitnessService {

  constructor() {}

  public getBmr(age: number, gender: string, height: number, weight: number): number {
    if (gender === 'male') {
      return Math.round(13.397 * weight + 4.799 * height - 5.677 * age + 88.362);
    } else {
      return Math.round(9.247 * weight + 3.098 * height - 4.33 * age + 447.593);
    }
  }

  public getBodyFat(age: number, gender: string, height: number, hips: number, neck: number, waist: number): number {
    if (gender === 'male') {
      return +(495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450).toFixed(2);
    } else {
      return +(495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.221 * Math.log10(height)) - 450).toFixed(2);
    }
  }

  public getIdealBodyFat(gender: string): number {
    return gender === 'male' ? 12 : 21;
  }

  public getIdealWeight(gender: string, height: number, weight: number): number {
    let extraInch: number = (height * 0.394) % 12;
    return gender === 'male' ? Math.round(52 + 1.9 * extraInch) : Math.round(49 + 1.7 * extraInch);
  }

}
