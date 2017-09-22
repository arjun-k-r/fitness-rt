// Angular
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  AlertController,
  IonicPage,
  NavController,
  Popover,
  PopoverController
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Meal, MealPlan, Nutrition } from '../../models';

// Providers
import { MealProvider } from '../../providers';

@IonicPage({
  name: 'nutrition'
})
@Component({
  templateUrl: 'nutrition.html',
})
export class NutritionPage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _mealSubscription: Subscription;
  public dailyNutrition: Nutrition = new Nutrition();
  public mealPlan: MealPlan = new MealPlan();
  public nutritionSegment: string = 'meals';
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _mealPvd: MealProvider,
    private _navCtrl: NavController,
    private _popoverCtrl: PopoverController
  ) { }

  public addMeal(): void {
    const newMeal: Meal = new Meal();
    this.mealPlan.meals = this.mealPlan.meals ? [...this.mealPlan.meals, newMeal] : [newMeal];
    this._navCtrl.push('meal-edit', {
      id: newMeal.hour,
      mealIdx: this.mealPlan.meals.length - 1,
      mealPlan: this.mealPlan
    });
  }

  public editMeal(idx: number): void {
    this._navCtrl.push('meal-edit', {
      id: this.mealPlan.meals[idx].hour,
      mealIdx: idx,
      mealPlan: this.mealPlan
    });
  }

  public nutrientPercent(nutrientValue: number, nutrientName: string): number {
    return this._mealPvd.calculateNutrientPercentage(nutrientValue, nutrientName);
  }

  public showSettings(event: Popover): void {
    const popover: Popover = this._popoverCtrl.create('settings');
    popover.present({
      ev: event
    });
  }

  ionViewCanEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!auth) {
        this._navCtrl.setRoot('registration', {
          history: 'nutrition'
        });
      };
    })
  }

  ionViewWillEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._authId = auth.uid;
        this._mealSubscription = this._mealPvd.getMealPlan$(this._authId).subscribe(
          (mealPlan: MealPlan) => {
            this.mealPlan = Object.assign({}, mealPlan['$value'] === null ? this.mealPlan : mealPlan);
            this._mealPvd.calculateDailyNutrition(this._authId, this.mealPlan).then((dailyNutrition: Nutrition) => this.dailyNutrition = Object.assign({}, dailyNutrition))
              .catch((err: Error) => {
                this._alertCtrl.create({
                  title: 'Uhh ohh...',
                  subTitle: 'Something went wrong',
                  message: err.toString(),
                  buttons: ['OK']
                }).present();
              });
          },
          (err: firebase.FirebaseError) => {
            this._alertCtrl.create({
              title: 'Uhh ohh...',
              subTitle: 'Something went wrong',
              message: err.message,
              buttons: ['OK']
            }).present();
          }
        );
      }
    });
  }

  ionViewWillLeave(): void {
    this._authSubscription && this._authSubscription.unsubscribe();
    this._mealSubscription && this._mealSubscription.unsubscribe();
  }
}
