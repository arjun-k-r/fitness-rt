// App
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// Models
import { Food, FoodGroup } from '../models';

export const FOOD_GROUPS: Array<FoodGroup> = [
  new FoodGroup('', 'All foods'),
  //new FoodGroup('3500', 'American Indian/Alaska Native Foods'),
  //new FoodGroup('0300', 'Baby Foods'),
  //new FoodGroup('1800', 'Baked Products'),
  new FoodGroup('1300', 'Beef Products'),
  new FoodGroup('1400', 'Beverages'),
  //new FoodGroup('0800', 'Breakfast Cereals'),
  new FoodGroup('2000', 'Cereal Grains and Pasta'),
  new FoodGroup('0100', 'Dairy and Egg Products'),
  //new FoodGroup('2100', 'Fast Foods'),
  new FoodGroup('0400', 'Fats and Oils'),
  new FoodGroup('1500', 'Finfish and Shellfish Products'),
  new FoodGroup('0900', 'Fruits and Fruit Juices'),
  new FoodGroup('1700', 'Lamb, Veal, and Game Products'),
  new FoodGroup('1600', 'Legumes and Legume Products'),
  //new FoodGroup('2200', 'Meals, Entrees, and Side Dishes'),
  new FoodGroup('1200', 'Nut and Seed Products'),
  new FoodGroup('1000', 'Pork Products'),
  new FoodGroup('0500', 'Poultry Products'),
  //new FoodGroup('3600', 'Restaurant Foods'),
  //new FoodGroup('0700', 'Sausages and Luncheon Meats'),
  //new FoodGroup('2500', 'Snacks'),
  //new FoodGroup('0600', 'Soups, Sauces, and Gravies'),
  new FoodGroup('0200', 'Spices and Herbs'),
  new FoodGroup('1900', 'Sweets'),
  new FoodGroup('1100', 'Vegetables and Vegetable Products'),
];

const NUTRIENT_MEANS: { fat: number, fiber: number, lactose: number, sodium: number, sugars: number, vitaminC: number, water: number } = {
  'fat': 30,
  'fiber': 10,
  'lactose': 3,
  'sodium': 0.1,
  'sugars': 10,
  'vitaminC': 0.04,
  'water': 50
};

@Injectable()
export class FoodService {
  private _usdaApiKey: string = '5nW8It7ORsxY212bV5wpleHkblTLbvpFTKVa010U';
  private _usdaSource: string = 'Standard+Reference';
  private _foodListUrl: string = 'https://api.nal.usda.gov/ndb/search/';
  private _foodNutritionUrl: string = 'https://api.nal.usda.gov/ndb/reports/';
  constructor(private _http: Http) { }

  private _serializeFood(usdaFood: any): Food {
    let newFood: Food = new Food(usdaFood['ndbno'], usdaFood['name'], usdaFood['fg']);
    newFood.nutrition.setNutrientValue(usdaFood['nutrients']);
    console.log(newFood);
    return newFood;
  }

  private _checkAstrigent(food: Food, cooked: boolean): boolean {
    /**
     * Tannins
     * Water absorbant
     * Low fat
     */
    return food.nutrition.fats.value <= NUTRIENT_MEANS.fat;
  }

  private _checkBitter(food: Food): boolean {
    /**
     * Alkalies
     * High fiber foods
     */
    return food.nutrition.fiber.value >= NUTRIENT_MEANS.fiber;
  }

  private _checkPungent(food: Food): boolean {
    /**
     * Acids
     * Spicy foods
     * High vitamin C herbs, spices, and vegetables
     */
    return (food.group === 'Spices and Herbs' || food.group === 'Vegetables') && food.nutrition.vitaminC.value >= NUTRIENT_MEANS.vitaminC;
  }

  private _checkSalty(food: Food): boolean {
    /**
     * Fish, seafood, and high sodium foods
     */
    return food.nutrition.sodium.value >= NUTRIENT_MEANS.sodium || food.group === 'Finfish and Shellfish Products';
  }

  private _checkSour(food: Food, cooked: boolean): boolean {
    /**
     * Citrus and fermented foods
     */
    return (food.group === 'Fruits and Fruit Juices' && food.nutrition.sugars.value <= NUTRIENT_MEANS.sugars) || food.nutrition.alcohol.value >= 0 || food.name.toLocaleLowerCase().includes('vinegar') || (food.group === 'Dairy and Egg Products' && food.nutrition.lactose.value < NUTRIENT_MEANS.lactose);
  }

  public checkFood(dosha: string, food: Food): boolean {
    /**
     * Vata must avoid raw, dry, dehydrated, frozen, cold, uncooked foods, with caffeine, and alcohol
     */

    return true;
  }

  public classifyFood(food: Food, cooked: boolean): void {
    if (this._checkAstrigent(food, cooked)) {
      food.type = 'astrigent';
    } else if (this._checkSalty(food)) {
      food.type = 'salty'
    } else if (this._checkPungent(food)) {
      food.type = 'pungent';
    } else if (this._checkSour(food, cooked)) {
      food.type = 'sour';
    } else if (this._checkBitter(food)) {
      food.type = 'bitter';
    } else {
      food.type = 'sweet';
    }
  }

  public getFoodReports$(foodId: string = ''): Promise<Food> {
    let headers: Headers = new Headers({ 'Content-Type': 'application/json' }),
      options: RequestOptions = new RequestOptions(),
      params: URLSearchParams = new URLSearchParams();

    params.set('api_key', this._usdaApiKey);
    params.set('ndbno', foodId);
    params.set('type', 'f');
    options.headers = headers;
    options.search = params;

    return new Promise((resolve, reject) => {
      this._http.get(this._foodNutritionUrl, options)
        .map((res: Response) => {
          let body = res.json();
          console.log(body);
          if (body.hasOwnProperty('errors')) {
            console.log(body.errors);
            return null;
          }

          return this._serializeFood(body['report']['food']);
        }).subscribe((data: Food) => {
          if (!!data) {
            resolve(data);
          } else {
            reject(data);
          }
        });
    });
  }

  public getFoods$(searhQuery: string = '', start: number = 0, limit: number = 100, foodGroupId: string = ''): Observable<Array<Food>> {
    let headers: Headers = new Headers({ 'Content-Type': 'application/json' }),
      options: RequestOptions = new RequestOptions(),
      params: URLSearchParams = new URLSearchParams();

    params.set('api_key', this._usdaApiKey);
    params.set('ds', this._usdaSource);
    params.set('q', searhQuery);
    params.set('fg', foodGroupId);
    params.set('format', 'json');
    params.set('sort', 'n');
    params.set('max', `${limit}`);
    params.set('offset', `${start}`);
    options.headers = headers;
    options.search = params;

    return this._http.get(this._foodListUrl, options)
      .map((res: Response) => {
        let body = res.json();
        console.log(body);
        if (body.hasOwnProperty('errors')) {
          console.log(body.errors);
          throw body.errors.error[0];
        }
        return body['list']['item'];
      }).catch((err: any) => Observable.throw(err));
  }

  public getPRAL(food: Food): number {
    /**
     * PRAL formula by Dr. Thomas Remer
     * Determines the pH of food
     * If PRAL above 0, the food is acid forming
     * If PRAL below 0, the food is alkaline forming
     */
    return 0.49 * food.nutrition.protein.value + 0.037 * food.nutrition.phosphorus.value - 0.021 * food.nutrition.potassium.value - 0.026 * food.nutrition.magnesium.value - 0.013 * food.nutrition.calcium.value;
  }
}
