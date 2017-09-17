// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Ionic
import { Storage } from '@ionic/storage';

// Firebase
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Food, Nutrition } from '../../models';

export const FOOD_GROUPS: string[] = [
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
export class FoodProvider {
  private _foodGroupSubject: Subject<string> = new Subject();
  private _foods$: FirebaseListObservable<Food[]>;
  constructor(
    private _db: AngularFireDatabase,
    private _storage: Storage
  ) {
    this._foods$ = this._db.list('/foods', {
      query: {
        orderByChild: 'group',
        equalTo: this._foodGroupSubject
      }
    });
  }

  public calculateFoodDRI(food: Food): Promise<Nutrition> {
    return new Promise((resolve, reject) => {
      const nutrition: Nutrition = new Nutrition();
      const currentDay: number = moment().dayOfYear();
      this._storage.ready().then(() => {
        this._storage.get(`userRequirements-${currentDay}`).then((dri: Nutrition) => {
          for (let nutrientKey in food.nutrition) {
            nutrition[nutrientKey].value = Math.round((food.nutrition[nutrientKey].value * 100) / (dri[nutrientKey].value || 1));
          }
          resolve(nutrition);
        }).catch((err: Error) => reject(err));
      }).catch((err: Error) => reject(err));
    });
  }

  public changeFoodGroup(foodGroup: string): void {
    this._foodGroupSubject.next(foodGroup);
  }

  public getFoods$(foodGroup: string): FirebaseListObservable<Food[]> {
    setTimeout(() => this.changeFoodGroup(foodGroup));
    return this._foods$;
  }

  public removeFood(food: Food): firebase.Promise<void> {
    return this._foods$.remove(food['$key']);
  }

  public saveFood(food: Food): firebase.Promise<void> {
    if (food.hasOwnProperty('$key')) {
      return this._foods$.update(food['$key'], food);
    } else {
      return this._foods$.push(food);
    }
  }
}