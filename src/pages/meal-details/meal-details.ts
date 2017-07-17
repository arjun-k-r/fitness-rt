// App
import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, Modal, ModalController, NavController, NavParams } from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Food, Meal, MealPlan, Recipe } from '../../models';

// Providers
import { MealService, NutritionService } from '../../providers';

@IonicPage({
  name: 'meal-details',
  segment: 'meal-details/:id'
})
@Component({
  selector: 'page-meal-details',
  templateUrl: 'meal-details.html'
})
export class MealDetailsPage {
  public meal: Meal;
  public mealIdx: number;
  public mealDetails: string = 'details';
  public mealPlan: MealPlan;
  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _mealSvc: MealService,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _nutritionSvc: NutritionService,
    private _params: NavParams
  ) {
    this.meal = <Meal>_params.get('meal');
    this.mealPlan = <MealPlan>_params.get('mealPlan');
    this.mealIdx = <number>_params.get('id');
    this.meal.mealItems = this.meal.mealItems || [];
  }

  private _changeServings(item: Food | Recipe): void {
    this._alertCtrl.create({
      title: 'Servings',
      subTitle: `${item.name.toString()} (${item.quantity.toString()}${item.unit.toString()})`,
      inputs: [
        {
          name: 'servings',
          placeholder: `Servings x ${item.quantity.toString()}${item.unit.toString()}`,
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
          handler: data => {
            item.servings = +data.servings;
            this._updateMealDetails();
          }
        }
      ]
    }).present();
  }

  private _removeItem(idx: number): void {
    this.meal.mealItems = [...this.meal.mealItems.slice(0, idx), ...this.meal.mealItems.slice(idx + 1)];
    this._updateMealDetails();
  }

  private _updateMealDetails(): void {
    this.meal.nutrition = Object.assign({}, this._nutritionSvc.calculateNutrition(this.meal.mealItems));
    this.meal.pral = this._mealSvc.calculatePRAL(this.meal.mealItems);
    this.meal.quantity = this._nutritionSvc.calculateQuantity(this.meal.mealItems);
    this.mealPlan.meals = this._mealSvc.sortMeals(this.mealPlan.meals);
    this._mealSvc.saveMealPlan(this.mealPlan);
  }

  public addMealItems(): void {
    let mealSelectModal: Modal = this._modalCtrl.create('food-select');
    mealSelectModal.present();
    mealSelectModal.onDidDismiss((selections: Array<Food | Recipe>) => {
      if (!!selections) {
        this.meal.mealItems = [...this.meal.mealItems, ...selections];
        this._updateMealDetails();
      }
    })
  }

  public changeItem(idx: number): void {
    this._actionSheetCtrl.create({
      title: 'Change item',
      buttons: [
        {
          text: 'Change servings',
          handler: () => {
            this._changeServings(this.meal.mealItems[idx]);
          }
        }, {
          text: 'Remove item',
          handler: () => {
            this._removeItem(idx);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();
  }

  public removeMeal(): void {
    this.mealPlan.meals = [...this.mealPlan.meals.slice(0, this.mealIdx), ...this.mealPlan.meals.slice(this.mealIdx + 1)];
    this._mealSvc.saveMealPlan(this.mealPlan);
    this._navCtrl.pop();
  }

  public saveMeal(): void {
    this._mealSvc.saveMealPlan(this.mealPlan);
  }

  ionViewCanEnter(): void {
    this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!auth) {
        this._navCtrl.setRoot('registration', {
          history: 'meal-details'
        });
      }
    })
  }
}
