import { Injectable } from '@angular/core';
import { User } from '@ionic/cloud-angular';

// Firebase
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

// Models
import { Meal, MealPlan, UserProfile } from '../models';

// Providers
import { ProfileService } from './profile.service';

@Injectable()
export class MealService {
  private _mealPlan: FirebaseObjectObservable<MealPlan>;
  constructor(private _af: AngularFire, private _profileSvc: ProfileService, private _user: User) {
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

  public getMealPlan(): Promise<MealPlan> {
    return new Promise(resolve => {
      this._mealPlan.subscribe((mealPlan: MealPlan) => {
        let newMealPlan: MealPlan = mealPlan || new MealPlan();
        newMealPlan.meals = this._getMeals();
        resolve(newMealPlan);
      });
    });
  }

}
