// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert, AlertController, Loading, LoadingController, NavController } from 'ionic-angular';

// Third-party
import { FirebaseListObservable } from 'angularfire2';

// Models
import { Meal, MealPlan } from '../../models';

// Pages
import { MealDetailsPage } from '../meal-details/meal-details';

// Providers
import { AlertService, MealService } from '../../providers';

@Component({
  selector: 'page-meal-plan',
  templateUrl: 'meal-plan.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MealPlanPage {
  public detailsPage: any = MealDetailsPage;
  public mealPlan: MealPlan;
  public mealPlanDetails: string = 'meals';
  public nourishingMeals$: FirebaseListObservable<Array<Meal>>;
  constructor(
    private _alertCtrl: AlertController,
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _mealSvc: MealService,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController
  ) { }

  public addToMealPlan(meal: Meal): void {
    this._alertCtrl.create({
      title: 'Meal hour',
      subTitle: 'Please select the hour of serving',
      inputs: [...this.mealPlan.meals.map((meal: Meal, mealIdx: number) => {
        return {
          type: 'radio',
          label: meal.time,
          value: mealIdx.toString()
        }
      })],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Done',
          handler: (data: string) => {
            let newMeal: Meal = Object.assign({}, meal);
            newMeal.time = this.mealPlan.meals[+data].time;
            newMeal.nourishingKey = '';
            newMeal.nickname = '';
            newMeal.wasNourishing = false;
            this._mealSvc.saveMeal(newMeal, +data, this.mealPlan);
          }
        }
      ]
    }).present();
  }

  public clearMeal(mealIdx: number): void {
    let updatedMeal: Meal = new Meal();
    updatedMeal.time = this.mealPlan.meals[mealIdx].time;
    this.mealPlan.meals[mealIdx] = updatedMeal;
    this._mealSvc.saveMeal(updatedMeal, mealIdx, this.mealPlan);
    this._detectorRef.markForCheck();
  }

  public reorganizeMeals(): void {
    this._mealSvc.reorganizeMeals(this.mealPlan);
  }

  public segmentChange(): void {
    this._detectorRef.markForCheck();
  }

  public saveMealPlan(): void {
    this._mealSvc.saveMealPlan(this.mealPlan);
  }

  public toggleNourishing(mealIdx: number): void {
    this.mealPlan.meals[mealIdx].wasNourishing = !this.mealPlan.meals[mealIdx].wasNourishing;
    if (!!this.mealPlan.meals[mealIdx].wasNourishing) {
      let alert: Alert = this._alertCtrl.create({
        title: 'Nickname',
        subTitle: 'Please give a nickname to this nourishing meal',
        inputs: [
          {
            name: 'nickname',
            placeholder: 'e.g. My special healthy breakfast',
            type: 'string'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Done',
            handler: data => {
              this.mealPlan.meals[mealIdx].nickname = data.nickname;
              this._mealSvc.saveMeal(this.mealPlan.meals[mealIdx], mealIdx, this.mealPlan);
            }
          }
        ]
      });
      alert.present();
    } else {
      this.mealPlan.meals[mealIdx].nickname = '';
      this._mealSvc.saveMeal(this.mealPlan.meals[mealIdx], mealIdx, this.mealPlan);
    }
  }

  ionViewWillEnter(): void {
    let loader: Loading = this._loadCtrl.create({
      content: 'Loading...',
      spinner: 'crescent'
    });

    loader.present();
    this.nourishingMeals$ = this._mealSvc.getNourishingMeals$();
    this._mealSvc.getMealPlan$().subscribe((mealPlan: MealPlan) => {
      console.log('Received meal plan: ', mealPlan);
      this.mealPlan = mealPlan;
      this.mealPlan.meals = this.mealPlan.meals || [];
      loader.dismiss();
      this._detectorRef.markForCheck();
    });
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
}
