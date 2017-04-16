import { Injectable } from '@angular/core';
import { User } from '@ionic/cloud-angular';
import { Observable } from 'rxjs/Observable';

// Firebase
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

// Models
import { Food, IUsdaFood, Meal, MealFoodItem, MealPlan, Nutrition, UserProfile } from '../models';

// Providers
import { FoodDataService } from './food-data.service';
import { ProfileService } from './profile.service';

@Injectable()
export class MealService {
  private _mealPlan: FirebaseObjectObservable<MealPlan>;
  constructor(
    private _af: AngularFire,
    private _foodDataSvc: FoodDataService,
    private _profileSvc: ProfileService,
    private _user: User
  ) {
    this._mealPlan = _af.database.object(`/meal-plans/${_user.id}/${new Date().getDay()}`);
  }

  private _getMeals(): Array<Meal> {
    let profile: UserProfile = this._profileSvc.getProfile(),
      breakfastTime: number = +profile.mealPlan.breakfastTime.split(':')[0],
      meals: Array<Meal> = [],
      mealTime: number = breakfastTime,
      newMeal: Meal,
      sleepTime: number = +profile.sleepPlan.schedule.start.split(':')[0];

    do {
      newMeal = new Meal();
      newMeal.time = mealTime < 10 ? `0${mealTime}:00` : `${mealTime}:00`;
      meals.push(newMeal);
      mealTime += +profile.mealPlan.interval;
    } while (mealTime < sleepTime - 2);

    return meals;
  }

  public getMealNutrition(items: Array<MealFoodItem>): Nutrition {
    let nutrition: Nutrition = new Nutrition();
    items.forEach((item: MealFoodItem) => {

    });
    return nutrition;
  }

  public getMealPlan(): Promise<MealPlan> {
    return new Promise(resolve => {
      this._mealPlan.subscribe((mealPlan: MealPlan) => {
        let newMealPlan: MealPlan = mealPlan || new MealPlan();
        newMealPlan.meals = this._getMeals();
        resolve(newMealPlan);
      });
    });
  }

  public serializeMealItems(items: Array<IUsdaFood>): Observable<MealFoodItem> {
    return new Observable(observer => items.forEach((item: IUsdaFood) => this._foodDataSvc.getFoodReports$(item.ndbno).then((food: Food) => observer.next(new MealFoodItem(food.group, food.name, food.ndbno)))));
  }

}
