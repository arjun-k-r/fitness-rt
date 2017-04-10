// App
import { Injectable } from '@angular/core';

// Models
import { Nutrition } from '../models';

@Injectable()
export class NutritionService {

  constructor() {
    console.log('Hello NutritionService Provider');
  }

  /**
   * TODO: Add requirements methods for each nutrient
   * Tip: Use switch to find the age interval
   */

  private _getAlaDri(age: number): number {
    switch (age) {
      case 18:
        
        break;
    
      default:
        break;
    }
    return 0;
  }

  public getDri(): Nutrition {

    return new Nutrition();
  }

}
