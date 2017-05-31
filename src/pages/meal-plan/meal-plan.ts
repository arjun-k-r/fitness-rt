// App
import { Component } from '@angular/core';
import { Alert, AlertController, Loading, LoadingController, NavController } from 'ionic-angular';
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
  public mealPlan: MealPlan;
  public mealPlanDetails: string = 'guidelines';
  public nourishingMeals$: FirebaseListObservable<Array<Meal>>;
  public omega36Ratio: number;
  public pral: number;
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
            this.mealPlan.meals[+data] = newMeal;
            this._mealSvc.saveMeal(newMeal, this.mealPlan);
          }
        }
      ]
    }).present();
  }

  public clearMeal(meal: Meal): void {
    let mealIdx: number = this.mealPlan.meals.indexOf(meal),
      updatedMeal: Meal = new Meal();
    updatedMeal.time = this.mealPlan.meals[mealIdx].time;
    this.mealPlan.meals[mealIdx] = updatedMeal;
    this._mealSvc.saveMeal(updatedMeal, this.mealPlan);
  }

  public reorganizeMeals(): void {
    this._mealSvc.reorganizeMeals(this.mealPlan);
  }

  public resetMealPlan(): void {
    let newMealPlan: MealPlan = new MealPlan();
    newMealPlan.meals = [...this._mealSvc.getMeals(this.mealPlan.breakfastTime)];
    this.mealPlan = Object.assign({}, newMealPlan);
  }

  public saveMealPlan(): void {
    this.mealPlan.dailyNutrition = this._nutritionSvc.getPercentageNutrition(this.mealPlan.meals, true);
    this._mealSvc.saveMealPlan(this.mealPlan);
  }

  public toggleNourishing(meal: Meal): void {
    meal.wasNourishing = !meal.wasNourishing;
    if (!!meal.wasNourishing) {
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
            handler: () => {
              meal.wasNourishing = false;
            }
          },
          {
            text: 'Done',
            handler: data => {
              meal.nickname = data.nickname;
              this._mealSvc.saveMeal(meal, this.mealPlan);
            }
          }
        ]
      });
      alert.present();
    } else {
      meal.nickname = '';
      this._mealSvc.saveMeal(meal, this.mealPlan);
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
    this._mealPlanSubscription = this._mealSvc.getMealPlan$().subscribe((mealPlan: MealPlan) => {
      console.log('Received meal plan: ', mealPlan);
      this.mealPlan = Object.assign({}, mealPlan);
      this.omega36Ratio = this._nutritionSvc.getOmega36Ratio(this.mealPlan.dailyNutrition);
      this.pral = this._mealSvc.getNutritionPral(this.mealPlan);
      this.mealPlan.dailyNutrition = this._nutritionSvc.getPercentageNutrition(this.mealPlan.meals, true);
      loader.dismiss();
    });
  }

  ionViewWillLeave(): void {
    this._mealPlanSubscription.unsubscribe();
  }
}
