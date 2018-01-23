// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Subject } from 'rxjs/Subject';

// Firebase
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';

// Models
import { Food } from '../../models';

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
    private _db: AngularFireDatabase
  ) {
    this._foods$ = this._db.list('/foods/usda', {
      query: {
        orderByChild: 'group',
        equalTo: this._foodGroupSubject
      }
    });
  }

  public changeFoodGroup(group: string): void {
    this._foodGroupSubject.next(group);
  }

  public getMyFoods$(authId: string): FirebaseListObservable<Food[]> {
    return this._db.list(`/${authId}/foods`, {
      query: {
        orderByChild: 'group',
        equalTo: this._foodGroupSubject
      }
    });
  }

  public getUSDAFoods$(group: string): FirebaseListObservable<Food[]> {
    setTimeout(() => {
      this.changeFoodGroup(group);
    });
    return this._foods$;
  }

  public removeFood(authId: string, food: Food): Promise<void> {
    return this._db.list(`/${authId}/foods`).remove(food['$key']);
  }

  public saveFood(authId: string, food: Food): any {
    if (food.hasOwnProperty('$key')) {
      return this._db.list(`/${authId}/foods`).update(food['$key'], food);
    } else {
      return this._db.list(`/${authId}/foods`).push(food);
    }
  }
}