// Angular
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  Popover,
  PopoverController
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Third-party
import { sortBy } from 'lodash';

// Models
import { ILineChartEntry, Meal, MealPlan, Nutrition, NutritionLog } from '../../models';

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
  private _loader: Loading;
  private _mealSubscription: Subscription;
  private _nutritionGoalSubscription: Subscription;
  private _weekLogSubscription: Subscription;
  private _weekLog: NutritionLog[] = [];
  public chartData: ILineChartEntry[] = [];
  public chartDataSelection: string = 'energy';
  public chartLabels: string[] = [];
  public chartOpts: any = { responsive: true };
  public dailyNutrition: Nutrition = new Nutrition();
  public mealPlan: MealPlan = new MealPlan();
  public nutrientKeys: string[] = [];
  public nutritionSegment: string = 'dayLog';
  public nutritionView: string = 'meals';
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _loadCtrl: LoadingController,
    private _mealPvd: MealProvider,
    private _navCtrl: NavController,
    private _popoverCtrl: PopoverController
  ) { }

  public addMeal(): void {
    this._navCtrl.push('meal-edit', {
      mealPlan: this.mealPlan,
      nutritionLog: this._weekLog
    });
  }

  public changeChartData(): void {
    this.chartData = [{
      data: [...this._weekLog.map((log: NutritionLog) => log.nutrition[this.chartDataSelection].value)],
      label: `${this.mealPlan.nutrition[this.chartDataSelection].name} intake`
    }];
  }

  public changeView(): void {
    this.nutritionView = this.nutritionView === 'meals' ? 'nutrition' : 'meals';
  }

  public editMeal(idx: number): void {
    this._navCtrl.push('meal-edit', {
      id: this.mealPlan.meals[idx].hour,
      mealIdx: idx,
      mealPlan: this.mealPlan,
      nutritionLog: this._weekLog
    });
  }

  public getPrevPlan(): void {
    this._alertCtrl.create({
      title: 'Copy yesterday meals?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this._loader = this._loadCtrl.create({
            content: 'Please wait...',
            duration: 10000,
            spinner: 'crescent'
          });
          this._loader.present();
          const subscription: Subscription = this._mealPvd.getPrevMealPlan$(this._authId).subscribe(
            (mealPlan: MealPlan) => {
              this.mealPlan = Object.assign({}, mealPlan['$value'] === null ? this.mealPlan : mealPlan);
              this._mealPvd.saveMealPlan(this._authId, this.mealPlan, this._weekLog);

              if (this._loader) {
                this._loader.dismiss();
                this._loader = null;
              }
              
              subscription.unsubscribe();
            },
            (err: firebase.FirebaseError) => {
              if (this._loader) {
                this._loader.dismiss();
                this._loader = null;
              }
              this._alertCtrl.create({
                title: 'Uhh ohh...',
                subTitle: 'Something went wrong',
                message: err.message,
                buttons: ['OK']
              }).present();
            }
          );
        }
      }, {
        text: 'No'
      }]
    }).present();
  }

  public nutrientPercent(nutrientValue: number, nutrientName: string): number {
    return this._mealPvd.calculateNutrientPercentage(nutrientValue, nutrientName);
  }

  public saveMealPlan(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();
    this.mealPlan.nutrition = this._mealPvd.calculateMealPlanNutrition(this.mealPlan.meals);
    this._mealPvd.saveMealPlan(this._authId, this.mealPlan, this._weekLog).then(() => {
      if (this._loader) {
        this._loader.dismiss();
        this._loader = null;
      }
      this._alertCtrl.create({
        title: 'Success!',
        message: 'Meal plan saved successfully!',
        buttons: ['Great']
      }).present();
    })
      .catch((err: Error) => {
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.toString(),
          buttons: ['OK']
        }).present();
      });
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
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._navCtrl.setRoot('registration', {
          history: 'nutrition'
        });
      };
    })
  }

  ionViewWillEnter(): void {
    this._loader = this._loadCtrl.create({
      content: 'Loading...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._authId = auth.uid;

        // Subscribe to meal plan
        this._mealSubscription = this._mealPvd.getMealPlan$(this._authId).subscribe(
          (mealPlan: MealPlan) => {
            this.mealPlan = Object.assign({}, mealPlan['$value'] === null ? this.mealPlan : mealPlan);
            this.mealPlan.meals = this.mealPlan.meals ? sortBy(this.mealPlan.meals, (meal: Meal) => meal.hour) : [];
            this.nutrientKeys = Object.keys(this.mealPlan.nutrition);
            this._mealPvd.calculateDailyNutrition(this._authId, this.mealPlan).then((dailyNutrition: Nutrition) => {
              this.dailyNutrition = Object.assign({}, dailyNutrition);
              if (this._loader) {
                this._loader.dismiss();
                this._loader = null;
              }
            })
              .catch((err: Error) => {
                if (this._loader) {
                  this._loader.dismiss();
                  this._loader = null;
                }
                this._alertCtrl.create({
                  title: 'Uhh ohh...',
                  subTitle: 'Something went wrong',
                  message: err.toString(),
                  buttons: ['OK']
                }).present();
              });
          },
          (err: firebase.FirebaseError) => {
            if (this._loader) {
              this._loader.dismiss();
              this._loader = null;
            }
            this._alertCtrl.create({
              title: 'Uhh ohh...',
              subTitle: 'Something went wrong',
              message: err.message,
              buttons: ['OK']
            }).present();
          }
        );

        // Subscribe to last 7 days meal plans
        this._weekLogSubscription = this._mealPvd.getNutritionLog$(this._authId).subscribe(
          (weekLog: NutritionLog[] = []) => {
            this.chartLabels = [...weekLog.map((log: NutritionLog) => log.date)];
            this._weekLog = [...weekLog];
            this.chartData = [{
              data: [...this._weekLog.map((log: NutritionLog) => log.nutrition.energy.value)],
              label: 'Energy intake'
            }];
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
    this._nutritionGoalSubscription && this._nutritionGoalSubscription.unsubscribe();
    this._weekLogSubscription && this._weekLogSubscription.unsubscribe();
    if (this._loader) {
      this._loader.dismiss();
      this._loader = null;
    }
  }
}
