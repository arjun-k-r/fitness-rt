// Angular
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  Modal,
  ModalController,
  NavController,
  NavParams
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Food, Meal, MealPlan, Recipe } from '../../models';

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
  private _mealIdx: number;
  private _mealPlan: MealPlan;
  public meal: Meal;
  public mealSegment: string = 'info';
  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _mealPvd: MealProvider,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this._mealIdx = <number>this._params.get('mealIdx');
    this._mealPlan = <MealPlan>this._params.get('mealPlan');
    this.meal = this._mealPlan.meals[this._mealIdx];
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
    this._mealPlan.meals = this._mealPvd.sortMeals(this._mealPlan.meals);
    this._mealPlan.nutrition = this._mealPvd.calculateMealPlanNutrition(this._mealPlan.meals);
    this.meal.combos.overeating = this._mealPvd.checkOvereating(this.meal);
    const lifePoints = this._mealPvd.checkLifePoints(this._mealPlan);
    if (this._mealPlan.lifePoints > lifePoints) {
      this._alertCtrl.create({
        title: 'Watch your nutrition and eating habits!',
        message: 'You are losing life points!',
        buttons: ['I will']
      }).present();
    } else {
      this._alertCtrl.create({
        title: 'You have improved your nutrition and eating habits!',
        message: 'You are gaining life points!',
        buttons: ['Great!']
      }).present();
    }
    this._mealPlan.lifePoints = lifePoints;
    this._mealPlan.intoleranceList = this._mealPvd.checkMealPlanFoodIntolerance(this._mealPlan);
  }

  public addFood(): void {
    const foodListModal: Modal = this._modalCtrl.create('food-list', { authId: this._authId });
    foodListModal.present();
    foodListModal.onDidDismiss((foods: (Food | Recipe)[]) => {
      if (!!foods) {
        const antinutrientFoods: Food[] = this._mealPvd.checkMealFoodAntinutrients([], foods);
        if (!!antinutrientFoods.length) {
          this._alertCtrl.create({
            title: 'Watch out!',
            message: `${antinutrientFoods.reduce((strList: string, food: Food, idx: number) => strList += `${food.name}${idx < intoleratedFoods.length - 2 && ', '}`, '')} are plant seeds and contain antinutrients.`,
            buttons: ['I will']
          }).present();
        }
        const intoleratedFoods: Food[] = this._mealPvd.checkMealFoodIntolerance([], foods, this._mealPlan.intoleranceList);
        if (!!intoleratedFoods.length) {
          this._alertCtrl.create({
            title: 'Watch out!',
            message: `${intoleratedFoods.reduce((strList: string, food: Food, idx: number) => strList += `${food.name}${idx < intoleratedFoods.length - 2 && ', '}`, '')} seem to have caused you digestive problems in the past`,
            buttons: ['I will']
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
    this._mealPlan.meals = [...this._mealPlan.meals.slice(0, this._mealIdx), ...this._mealPlan.meals.slice(this._mealIdx + 1)];
    this._mealPlan.nutrition = this._mealPvd.calculateMealPlanNutrition(this._mealPlan.meals)
    this._mealPvd.saveMealPlan(this._authId, this._mealPlan)
      .then(() => {
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
      .catch((err: Error) => {
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.toString(),
          buttons: ['OK']
        }).present();
      });
  }

  public saveMeal(): void {
    this._mealPvd.saveMealPlan(this._authId, this._mealPlan)
      .then(() => {
        this._alertCtrl.create({
          title: 'Success!',
          message: 'Meals saved successfully!',
          buttons: ['Great!']
        }).present();
      })
      .catch((err: Error) => {
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.toString(),
          buttons: ['OK']
        }).present();
      });
  }

  ionViewWillEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._authId = auth.uid;
      }
    });
  }

  ionViewWillLeave(): void {
    this._authSubscription && this._authSubscription.unsubscribe();
  }
}
