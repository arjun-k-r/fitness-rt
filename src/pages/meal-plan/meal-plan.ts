// App
import { Component } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController } from 'ionic-angular';
import { Auth } from '@ionic/cloud-angular';
import { Subscription } from 'rxjs/Subscription';

// Models
import { Meal, MealPlan } from '../../models';

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
  private _favouriteMealSubscription: Subscription;
  private _mealPlanSubscription: Subscription;
  public favouriteMeals: Array<Meal>;
  public isDirty: boolean = false;
  public mealPlan: MealPlan = new MealPlan();
  public mealPlanDetails: string = 'guidelines';
  constructor(
    private _alertCtrl: AlertController,
    private _auth: Auth,
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

  public loadFavourites(): void {
    if (!this._favouriteMealSubscription) {
      let loader: Loading = this._loadCtrl.create({
        content: 'Loading...',
        spinner: 'crescent',
        duration: 30000
      });

      loader.present();
      this._favouriteMealSubscription = this._mealSvc.getFavouriteMeals$().subscribe((meals: Array<Meal>) => {
        this.favouriteMeals = [...meals];
        loader.dismiss();
      });
    }
  }

  public resetMealPlan(): void {
    this.mealPlan = new MealPlan();
    this.isDirty = true;
  }

  public saveMealPlan(): void {
    this._mealSvc.saveMealPlan(this.mealPlan);
    this.isDirty = false;
  }

  ionViewCanEnter(): boolean {
    if (!this._auth.isAuthenticated()) {
      this._navCtrl.setRoot('registration');
      return false;
    }
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
      spinner: 'crescent',
      duration: 30000
    });
    loader.present();
    this._mealPlanSubscription = this._mealSvc.getMealPlan$().subscribe((mealPlan: MealPlan) => {
      this.mealPlan = Object.assign({}, mealPlan);
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
    if (this._favouriteMealSubscription) {
      this._favouriteMealSubscription.unsubscribe();
    }
    this._mealPlanSubscription.unsubscribe();
  }
}
