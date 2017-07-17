// App
import { Component } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Essentials, Meal, MealPlan } from '../../models';

// Providers
import { FitnessService, MealService, NutritionService } from '../../providers';

@IonicPage({
  name: 'meal-plan'
})
@Component({
  selector: 'page-meal-plan',
  templateUrl: 'meal-plan.html'
})
export class MealPlanPage {
  private _mealPlanSubscription: Subscription;
  public dailyEssentials: Essentials = new Essentials();
  public favouriteMeals: Array<Meal>;
  public mealPlan: MealPlan = new MealPlan();
  public mealPlanDetails: string = 'guidelines';
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _fitSvc: FitnessService,
    private _loadCtrl: LoadingController,
    private _mealSvc: MealService,
    private _navCtrl: NavController,
    private _nutritionSvc: NutritionService
  ) { }

  public addNewMeal(): void {
    let mealIdx: number = this.mealPlan.meals.length;
    this.mealPlan.meals = [...this.mealPlan.meals, new Meal()];
    this._navCtrl.push('meal-details', { id: mealIdx, meal: this.mealPlan.meals[mealIdx], mealPlan: this.mealPlan });
  }

  public addToMealPlan(meal: Meal): void {
    this.mealPlan.meals = [...this.mealPlan.meals, new Meal(
      meal.mealItems,
      meal.nutrition,
      meal.pral,
      meal.quantity
    )];
    this.mealPlan.meals = [...this._mealSvc.sortMeals(this.mealPlan.meals)];
    this._mealSvc.saveMealPlan(this.mealPlan);
  }

  ionViewCanEnter(): void {
    this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!auth) {
        this._navCtrl.setRoot('registration', {
          history: 'meal-plan'
        });
      }
    })
  }

  ionViewWillEnter(): void {
    let loader: Loading = this._loadCtrl.create({
      content: 'Loading...',
      spinner: 'crescent',
      duration: 30000
    });
    loader.present();
    this._mealPlanSubscription = this._mealSvc.getMealPlan$().subscribe((mealPlan: MealPlan) => {
      this.mealPlan = Object.assign({}, mealPlan);
      this.dailyEssentials = this._mealSvc.calculateDailyEssentials(this.mealPlan.dailyNutrition);
      loader.dismiss();
    }, (error: Error) => {
      loader.dismiss();
      this._alertCtrl.create({
        title: 'Uhh ohh...',
        subTitle: 'Something went wrong',
        message: error.toString(),
        buttons: ['OK']
      }).present();
    });
  }

  ionViewWillLeave(): void {
    this._mealPlanSubscription.unsubscribe();
  }
}
