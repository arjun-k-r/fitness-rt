// App
import { Component } from '@angular/core';
import { AlertController, Loading, LoadingController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

// Third-party
import { FirebaseListObservable } from 'angularfire2/database';

// Models
import { Meal, MealPlan } from '../../models';

// Pages
import { MealDetailsPage } from '../meal-details/meal-details';

// Providers
import { FitnessService, MealService, NutritionService } from '../../providers';

@Component({
  selector: 'page-meal-plan',
  templateUrl: 'meal-plan.html'
})
export class MealPlanPage {
  private _mealPlanSubscription: Subscription;
  public detailsPage: any = MealDetailsPage;
  public favouriteMeals$: FirebaseListObservable<Array<Meal>>;
  public isDirty: boolean = false;
  public mealPlan: MealPlan = new MealPlan();
  public mealPlanDetails: string = 'guidelines';
  constructor(
    private _alertCtrl: AlertController,
    private _fitSvc: FitnessService,
    private _loadCtrl: LoadingController,
    private _mealSvc: MealService,
    private _navCtrl: NavController,
    private _nutritionSvc: NutritionService
  ) { }

  public addNewMeal(): void {
    this.mealPlan.meals = [...this.mealPlan.meals, new Meal()];
    this._navCtrl.push(this.detailsPage, { meal: this.mealPlan.meals[this.mealPlan.meals.length - 1], mealPlan: this.mealPlan });
  }

  public addToMealPlan(meal: Meal): void {
    this.mealPlan.meals = [...this.mealPlan.meals, new Meal(
      meal.favourite,
      meal.favouriteKey,
      meal.favouriteName,
      meal.mealItems,
      meal.nutrition,
      meal.pral,
      meal.quantity
    )];
    this.mealPlan.meals = [...this._mealSvc.sortMeals(this.mealPlan.meals)];
    this.isDirty = true;
  }

  public clearMeal(meal: Meal): void {
    let mealIdx: number = this.mealPlan.meals.indexOf(meal),
      updatedMeal: Meal = new Meal();
    updatedMeal.time = this.mealPlan.meals[mealIdx].time;
    this.mealPlan.meals[mealIdx] = updatedMeal;
    this.isDirty = true;
  }

  public resetMealPlan(): void {
    this.mealPlan = new MealPlan();
    this.isDirty = true;
  }

  public saveMealPlan(): void {
    this.isDirty = false;
    this.mealPlan.dailyNutrition = this._nutritionSvc.calculateNutritionPercent(this.mealPlan.meals, true);
    this.mealPlan.omega36Ratio = this._mealSvc.calculateOmega36RatioDaily(this.mealPlan.meals);
    this.mealPlan.pral = this._mealSvc.calculatePRALDaily(this.mealPlan.meals);
    this._mealSvc.saveMealPlan(this.mealPlan);
  }

  ionViewCanLeave(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isDirty) {
        this._alertCtrl.create({
          title: 'Discard changes',
          message: 'Changes have been made. Are you sure you want to leave?',
          buttons: [
            {
              text: 'Yes',
              handler: () => {
                resolve(true);
              }
            },
            {
              text: 'No',
              handler: () => {
                reject(true);
              }
            }
          ]
        }).present();
      } else {
        resolve(true);
      }
    });
  }

  ionViewWillEnter(): void {
    let loader: Loading = this._loadCtrl.create({
      content: 'Loading...',
      spinner: 'crescent'
    });

    loader.present();
    this.favouriteMeals$ = this._mealSvc.getFavouriteMeals$();
    this._mealPlanSubscription = this._mealSvc.getMealPlan$().subscribe((mealPlan: MealPlan) => {
      this.mealPlan = Object.assign({}, mealPlan);
      loader.dismiss();
    });
  }

  ionViewWillLeave(): void {
    this._mealPlanSubscription.unsubscribe();
  }
}
