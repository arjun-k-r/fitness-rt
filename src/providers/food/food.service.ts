// App
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Storage } from '@ionic/storage';

// Third-party
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';

// Models
import { Food, Nutrition } from '../../models';

// Providers
import { NutritionService } from '../nutrition/nutrition.service';

export const CURRENT_DAY: number = moment().dayOfYear();

export const FOOD_GROUPS: Array<string> = [
  'American Indian/Alaska Native Foods',
  'Baby Foods',
  'Baked Products',
  'Beef Products',
  'Beverages',
  'Breakfast Cereals',
  'Cereal Grains and Pasta',
  'Dairy and Egg Products',
  'Fast Foods',
  'Fats and Oils',
  'Finfish and Shellfish Products',
  'Fruits and Fruit Juices',
  'Lamb, Veal, and Game Products',
  'Legumes and Legume Products',
  'Meals, Entrees, and Side Dishes',
  'Nut and Seed Products',
  'Pork Products',
  'Poultry Products',
  'Restaurant Foods',
  'Sausages and Luncheon Meats',
  'Snacks',
  'Soups, Sauces, and Gravies',
  'Spices and Herbs',
  'Sweets',
  'Vegetables and Vegetable Products'
];

@Injectable()
export class FoodService {
  private _foodGroupSubject: Subject<string> = new Subject();
  private _foods$: FirebaseListObservable<Array<Food>>;
  constructor(
    private _db: AngularFireDatabase,
    private _nutritionSvc: NutritionService,
    private _storage: Storage
  ) {
    this._foods$ = this._db.list('/foods', {
      query: {
        orderByChild: 'group',
        equalTo: this._foodGroupSubject
      }
    });
  }

  public calculateFoodNutrition(food: Food): Promise<Nutrition> {
    return new Promise((resolve, reject) => {
      let nutrition: Nutrition = new Nutrition();
      this._storage.ready().then(() => {
        this._storage.get(`userRequirements${CURRENT_DAY}`).then((requirements: Nutrition) => {
          for (let nutrientKey in food.nutrition) {
            nutrition[nutrientKey].value = Math.round((food.nutrition[nutrientKey].value * 100) / (requirements[nutrientKey].value || 1));
          }
          resolve(nutrition);
        }).catch((err: Error) => reject(err));
      }).catch((err: Error) => reject(err));
    });
  }

  public changeFoodGroup(foodGroup: string): void {
    this._foodGroupSubject.next(foodGroup);
  }

  public getFoods$(foodGroup: string): Observable<Array<Food>> {
    setTimeout(() => this.changeFoodGroup(foodGroup));
    return this._foods$;
  }
}