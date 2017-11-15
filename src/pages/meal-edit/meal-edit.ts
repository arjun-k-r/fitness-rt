// Angular
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  Modal,
  ModalController,
  NavController,
  NavParams
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Food, Meal, MealPlan, NutritionLog, Recipe } from '../../models';

// Providers
import { MealProvider } from '../../providers';

@IonicPage({
  name: 'meal-edit',
  segment: 'meals/:id'
})
@Component({
  templateUrl: 'meal-edit.html',
})
export class MealEditPage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _foodIntoleranceSubscription: Subscription;
  private _intoleratedFoods: Food[] = [];
  private _loader: Loading;
  private _mealIdx: number;
  private _mealPlan: MealPlan;
  private _mealPlanFoodIntolerance: Food[] = [];
  private _nutritionGoalSubscription: Subscription;
  private _weekLog: NutritionLog[];
  public meal: Meal = new Meal();
  public mealSegment: string = 'info';
  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _loadCtrl: LoadingController,
    private _mealPvd: MealProvider,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this._mealPlan = <MealPlan>this._params.get('mealPlan');
    this._mealPlan.meals = this._mealPlan.meals || [];
    this._mealIdx = <number>this._params.get('mealIdx');
    this._mealIdx = this._mealIdx === undefined ? this._mealPlan.meals.length : this._mealIdx;
    this._weekLog = <NutritionLog[]>this._params.get('nutritionLog');
    this.meal = Object.assign({}, this._mealPlan.meals[this._mealIdx] || this.meal);
    this.meal.foods = this.meal.foods || [];
  }

  private _changeServings(food: Food | Recipe): void {
    this._alertCtrl.create({
      title: 'Servings',
      subTitle: `${food.name.toString()} (${food.quantity.toString()} g)`,
      inputs: [
        {
          name: 'servings',
          placeholder: `Servings x ${food.quantity.toString()} g`,
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Done',
          handler: (data: { servings: string }) => {
            food.servings = +data.servings;
            this._updateMeal();
          }
        }
      ]
    }).present();
  }

  private _removeFood(idx: number): void {
    this.meal.foods = [...this.meal.foods.slice(0, idx), ...this.meal.foods.slice(idx + 1)];
    this._updateMeal();
  }

  private _updateMeal(): void {
    this.meal.nutrition = this._mealPvd.calculateMealNutrition(this.meal.foods);
    this.meal.quantity = this._mealPvd.calculateMealQuantity(this.meal.foods);
    this._mealPlan.meals = [...this._mealPlan.meals.slice(0, this._mealIdx), this.meal, ...this._mealPlan.meals.slice(this._mealIdx + 1)];
    this._mealPlan.nutrition = this._mealPvd.calculateMealPlanNutrition(this._mealPlan.meals);
  }

  public addFood(): void {
    const foodListModal: Modal = this._modalCtrl.create('food-list', { authId: this._authId });
    foodListModal.present();
    foodListModal.onDidDismiss((foods: (Food | Recipe)[]) => {
      if (!!foods) {
        const antinutrientFoods: Food[] = this._mealPvd.checkMealFoodAntinutrients([], foods);
        this._mealPlanFoodIntolerance = this._mealPvd.checkMealFoodIntolerance([], foods, this._intoleratedFoods);
        if (!!antinutrientFoods.length || !!this._mealPlanFoodIntolerance.length) {
          this._modalCtrl.create('food-warning', {
            antinutrientFoods: antinutrientFoods,
            intoleratedFoods: this._mealPlanFoodIntolerance
          }).present();
        }
        this.meal.foods = this.meal.foods ? [...this.meal.foods, ...foods] : [...foods];
        this._updateMeal();
      }
    });
  }

  public changeFood(idx: number): void {
    this._actionSheetCtrl.create({
      title: 'Change item',
      buttons: [
        {
          text: 'Change servings',
          handler: () => {
            this._changeServings(this.meal.foods[idx]);
          }
        }, {
          text: 'Remove item',
          handler: () => {
            this._removeFood(idx);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();
  }

  public removeMeal(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();
    this._mealPlan.meals = [...this._mealPlan.meals.slice(0, this._mealIdx), ...this._mealPlan.meals.slice(this._mealIdx + 1)];
    this._mealPlan.nutrition = this._mealPvd.calculateMealPlanNutrition(this._mealPlan.meals);
    this._mealPvd.saveMealPlan(this._authId, this._mealPlan, this._weekLog, this._mealPlanFoodIntolerance)
      .then(() => {
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._alertCtrl.create({
          title: 'Success!',
          message: 'Meal removed successfully!',
          buttons: [{
            text: 'Great',
            handler: () => {
              this._navCtrl.pop();
            }
          }]
        }).present();
      })
      .catch((err: firebase.FirebaseError) => {
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
      });
  }

  public saveMeal(): void {
    this._updateMeal();
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();
    this._mealPvd.saveMealPlan(this._authId, this._mealPlan, this._weekLog).then(() => {
      if (this._loader) {
        this._loader.dismiss();
        this._loader = null;
      }
      this._alertCtrl.create({
        title: 'Success!',
        message: 'Meal plan saved successfully!',
        buttons: ['Great!']
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

  public viewIntoleratedFoods(): void {
    this._modalCtrl.create('food-intolerance', { authId: this._authId, foods: this._intoleratedFoods }).present();
  }


  ionViewWillEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._authId = auth.uid;

        this._foodIntoleranceSubscription = this._mealPvd.getIntoleratedFoods$(this._authId).subscribe(
          (foods: Food[]) => this._intoleratedFoods = [...foods],
          (err: firebase.FirebaseError) => {
            this._alertCtrl.create({
              title: 'Uhh ohh...',
              subTitle: 'Something went wrong',
              message: err.message,
              buttons: ['OK']
            }).present();
          }
        )
      }
    });
  }

  ionViewWillLeave(): void {
    this._authSubscription && this._authSubscription.unsubscribe();
    this._foodIntoleranceSubscription && this._foodIntoleranceSubscription.unsubscribe();
    this._nutritionGoalSubscription && this._nutritionGoalSubscription.unsubscribe();
    if (this._loader) {
      this._loader.dismiss();
      this._loader = null;
    }
  }
}
