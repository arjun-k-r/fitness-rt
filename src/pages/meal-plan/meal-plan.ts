// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert, AlertController, Loading, LoadingController, NavController } from 'ionic-angular';

// Third-party
import { FirebaseListObservable } from 'angularfire2/database';

// Models
import { Meal, MealPlan } from '../../models';

// Pages
import { MealDetailsPage } from '../meal-details/meal-details';

// Providers
import { AlertService, FitnessService, MealService, NutritionService } from '../../providers';

@Component({
  selector: 'page-meal-plan',
  templateUrl: 'meal-plan.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MealPlanPage {
  public detailsPage: any = MealDetailsPage;
  public mealPlan: MealPlan;
  public mealPlanDetails: string = 'meals';
  public omega36Ratio: number;
  public nourishingMeals$: FirebaseListObservable<Array<Meal>>;
  constructor(
    private _alertCtrl: AlertController,
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _fitSvc: FitnessService,
    private _loadCtrl: LoadingController,
    private _mealSvc: MealService,
    private _navCtrl: NavController,
    private _nutritionSvc: NutritionService
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

  public viewSymptoms(imbalanceKey: string, imbalanceName: string, imbalanceType: string): void {
    this._fitSvc.getImbalanceSymptoms$(imbalanceKey, imbalanceType).subscribe((signs: Array<string>) => {
      this._alertCtrl.create({
        title: `${imbalanceName} ${imbalanceType} symptoms`,
        subTitle: 'Check the symptoms which fit you',
        inputs: [...signs.map((sign: string) => {
          return {
            type: 'checkbox',
            label: sign,
            value: sign
          }
        })],
        buttons: [
          {
            text: 'Done',
            handler: (data: Array<string>) => {
              console.log('My symptoms are: ', data);
              if (data.length > signs.length / 4) {
                if (imbalanceType === 'deficiency') {
                  this._alertSvc.showAlert(`Try to to eat more ${imbalanceName} rich foods, okay?`, '', 'The time is now to make a change');
                } else {
                  this._alertSvc.showAlert(`Try to to limit your intake of ${imbalanceName}, okay?`, '', 'The time is now to make a change');
                }
              } else {
                this._alertSvc.showAlert("Anyway, make sure to take care of your nutrition and don't abuse or neglect any nutrient, okay?", '', 'I am not perfect');
              }
            }
          }
        ]
      }).present();
    });
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
      this.omega36Ratio = this._nutritionSvc.getOmega36Ratio(this.mealPlan.dailyNutrition);
      loader.dismiss();
      this._detectorRef.markForCheck();
    });
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
}
