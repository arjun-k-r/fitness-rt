// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Subject } from 'rxjs/Subject';

// Firebase
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';

// Models
import { Food, Nutrition } from '../../models';

// Providers
import { NutritionProvider } from '../nutrition/nutrition';

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
    private _nutritionPvd: NutritionProvider,
  ) {
    this._foods$ = this._db.list('/foods/usda', {
      query: {
        orderByChild: 'group',
        equalTo: this._foodGroupSubject
      }
    });
  }

  public calculateFoodRequirements(authId: string, food: Food): Promise<Nutrition> {
    return new Promise((resolve, reject) => {
      const nutrition: Nutrition = new Nutrition();
      this._nutritionPvd.getRequirements(authId).then((dailyRequirements: Nutrition) => {
        dailyRequirements = dailyRequirements['$value'] === null ? new Nutrition() : dailyRequirements;
        for (let nutrientKey in food.nutrition) {
          nutrition[nutrientKey].value = Math.round((food.nutrition[nutrientKey].value * 100) / (dailyRequirements[nutrientKey].value || 1));
        }
        resolve(nutrition);
      }).catch((err: firebase.FirebaseError) => reject(err.message));
    });
  }

  public changeFoodGroup(foodGroup: string): void {
    this._foodGroupSubject.next(foodGroup);
  }

  public getMyFoods$(authId: string): FirebaseListObservable<Food[]> {
    return this._db.list(`/foods/${authId}`);
  }

  public getUsdaFoods$(foodGroup: string): FirebaseListObservable<Food[]> {
    setTimeout(() => this.changeFoodGroup(foodGroup));
    return this._foods$;
  }

  public removeFood(authId: string, food: Food): Promise<void> {
    return this._db.list(`/foods/${authId}`).remove(food['$key']);
  }

  public saveFood(authId: string, food: Food): any{
    if (food.hasOwnProperty('$key')) {
      return this._db.list(`/foods/${authId}`).update(food['$key'], food);
    } else {
      return this._db.list(`/foods/${authId}`).push(food);
    }
  }
}