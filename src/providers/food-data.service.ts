// App
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// Models
import { Food, FoodGroup, INdbFood } from '../models';

export const FOOD_GROUPS: Array<FoodGroup> = [
  //new FoodGroup('', 'All foods'),
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

@Injectable()
export class FoodDataService {
  private _usdaApiKey: string = '5nW8It7ORsxY212bV5wpleHkblTLbvpFTKVa010U';
  private _usdaSource: string = 'Standard+Reference';
  private _foodListUrl: string = 'https://api.nal.usda.gov/ndb/search/';
  private _foodNutritionUrl: string = 'https://api.nal.usda.gov/ndb/reports/';
  constructor(private _http: Http) { }

  private _serializeFood(usdaFood: any): Food {
    let newFood: Food = new Food(usdaFood['ndbno'], usdaFood['name'], usdaFood['fg']);
    this._setNutrientValue(usdaFood['nutrients'], newFood);
    console.log(newFood);
    return newFood;
  }

  private _setNutrientValue(nutrients: Array<INdbFood>, food: Food): void {
    nutrients.forEach((item: INdbFood) => {
      switch (item.nutrient_id.toString()) {
        case '255':
          food.nutrition.water.value = +item.value;
          break;

        case '208':
          food.nutrition.energy.value = +item.value;
          break;

        case '203':
          food.nutrition.protein.value = +item.value;
          break;

        case '204':
          food.nutrition.fats.value = +item.value;
          break;

        case '205':
          food.nutrition.carbs.value = +item.value;
          break;

        case '209':
          food.nutrition.starch.value = +item.value;
          break;

        case '213':
          food.nutrition.lactose.value = +item.value;
          break;

        case '291':
          food.nutrition.fiber.value = +item.value;
          break;

        case '269':
          food.nutrition.sugars.value = +item.value;
          break;

        case '301':
          food.nutrition.calcium.value = +item.value;
          break;

        case '303':
          food.nutrition.iron.value = +item.value;
          break;

        case '304':
          food.nutrition.magnesium.value = +item.value;
          break;

        case '305':
          food.nutrition.phosphorus.value = +item.value;
          break;

        case '306':
          food.nutrition.potassium.value = +item.value;
          break;

        case '307':
          food.nutrition.sodium.value = +item.value;
          break;

        case '309':
          food.nutrition.zinc.value = +item.value;
          break;

        case '312':
          food.nutrition.copper.value = +item.value;
          break;

        case '315':
          food.nutrition.manganese.value = +item.value;
          break;

        case '317':
          food.nutrition.selenium.value = +item.value;
          break;

        case '401':
          food.nutrition.vitaminC.value = +item.value;
          break;

        case '404':
          food.nutrition.vitaminB1.value = +item.value;
          break;

        case '405':
          food.nutrition.vitaminB2.value = +item.value;
          break;

        case '406':
          food.nutrition.vitaminB3.value = +item.value;
          break;

        case '410':
          food.nutrition.vitaminB5.value = +item.value;
          break;

        case '415':
          food.nutrition.vitaminB5.value = +item.value;
          break;

        case '417':
          food.nutrition.vitaminB9.value = +item.value;
          break;

        case '421':
          food.nutrition.choline.value = +item.value;
          break;

        case '418':
          food.nutrition.vitaminB12.value = +item.value;
          break;

        case '320':
          food.nutrition.vitaminA.value = +item.value;
          break;

        case '323':
          food.nutrition.vitaminE.value = +item.value;
          break;

        case '328':
          food.nutrition.vitaminD.value = +item.value;
          break;

        case '430':
          food.nutrition.vitaminK.value = +item.value;
          break;

        case '606':
          food.nutrition.satFat.value = +item.value;
          break;

        case '618':
          food.nutrition.ala.value = +item.value;
          break;

        case '619':
          food.nutrition.la.value = +item.value;
          break;

        case '621':
          food.nutrition.dha.value = +item.value;
          break;

        case '629':
          food.nutrition.epa.value = +item.value;
          break;

        case '605':
          food.nutrition.transFat.value = +item.value;
          break;

        case '501':
          food.nutrition.tryptophan.value = +item.value;
          break;

        case '502':
          food.nutrition.threonine.value = +item.value;
          break;

        case '503':
          food.nutrition.isoleucine.value = +item.value;
          break;

        case '504':
          food.nutrition.leucine.value = +item.value;
          break;

        case '505':
          food.nutrition.lysine.value = +item.value;
          break;

        case '506':
          food.nutrition.methionine.value = +item.value;
          break;

        case '508':
          food.nutrition.phenylalanine.value = +item.value;
          break;

        case '510':
          food.nutrition.valine.value = +item.value;
          break;

        case '511':
          food.nutrition.arginine.value = +item.value;
          break;

        case '512':
          food.nutrition.histidine.value = +item.value;
          break;

        case '262':
          food.nutrition.caffeine.value = +item.value;
          break;

        case '221':
          food.nutrition.alcohol.value = +item.value;
          break;

        default:
          break;
      }
    });
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

  public getFoods$(searhQuery: string = '', start: number = 0, limit: number = 100, foodGroupId: string = '1100'): Observable<Array<Food>> {
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
}
