// Angular
import { Component } from '@angular/core';

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
import * as firebase from 'firebase/app';

// Models
import { Diet, Food, Meal, NutritionalValues, UserProfile } from '../../models';

// Providers
import { DietProvider, NotificationProvider, UserProfileProvider } from '../../providers';

@IonicPage({
  name: 'meal-details',
  segment: 'meals/:id'
})
@Component({
  templateUrl: 'meal-details.html',
})
export class MealDetailsPage {
  private _authId: string;
  private _diet: Diet;
  private _mealIdx: number;
  private _trends: Diet[];
  public meal: Meal;
  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _alertCtrl: AlertController,
    private _dietPvd: DietProvider,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _notifyPvd: NotificationProvider,
    private _params: NavParams,
    private _userPvd: UserProfileProvider
  ) {
    this._authId = this._params.get('authId');
    this._diet = <Diet>this._params.get('diet');
    this._diet.meals = this._diet.meals || [];
    this._mealIdx = <number>this._params.get('mealIdx') || this._diet.meals.length;
    this._trends = <Diet[]>this._params.get('trends');
    this.meal = Object.assign({}, this._diet.meals[this._mealIdx] || new Meal([], new NutritionalValues(), '', 0));
    this.meal.foods = this.meal.foods || [];
  }

  private _changeQuantity(food: Food): void {
    this._alertCtrl.create({
      title: 'Quantity',
      subTitle: `How much ${food.name} do you want to eat?`,
      inputs: [
        {
          name: 'quantity',
          placeholder: `${food.quantity.toString()} g`,
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
          handler: (data: { quantity: string }) => {
            food.quantity = +data.quantity;
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
    this.meal.nourishment = this._dietPvd.calculateNourishment(this.meal.foods);
    this.meal.quantity = this.meal.foods.reduce((quantity: number, food: Food) => quantity + food.quantity, 0);
    this._diet.meals = [...this._diet.meals.slice(0, this._mealIdx), this.meal, ...this._diet.meals.slice(this._mealIdx + 1)];
    this._diet.nourishment = this._dietPvd.calculateNourishment(this._diet.meals);
    this._userPvd.getUserProfile$(this._authId).subscribe((u: UserProfile) => {
      this._dietPvd.calculateRequirement(u.age, u.constitution, u.gender, u.isLactating, u.isPregnant, u.measurements.weight)
        .then((r: NutritionalValues) => {
          this._diet.nourishmentAchieved = this._dietPvd.calculateNourishmentFromRequirement(this._diet.nourishment, r);
        })
    }, (err: Error) => {
      this._notifyPvd.showError(err.message);
    });
  }

  public addFood(): void {
    const foodListModal: Modal = this._modalCtrl.create('food-list', { authId: this._authId });
    foodListModal.present();
    foodListModal.onDidDismiss((foods: (Food | Meal)[]) => {
      if (!!foods && !!foods.length) {
        let selectedFoods: any = foods.map((f: Food | Meal) => ('ndbno' in f) ? f : (<Meal>f).foods);
        this.meal.foods = [...this.meal.foods, ...[].concat(...selectedFoods)];
        this._updateMeal();
      }
    });
  }

  public addToFavorites(): void {
    this._alertCtrl.create({
      title: 'Favorite meal',
      subTitle: 'What is the name of this nutritious meal?',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Done',
          handler: (data: { name: string }) => {
            this.meal.name = data.name;
            this._notifyPvd.showLoading();
            this._dietPvd.saveFavoriteMeal(this._authId, this.meal)
              .then(() => {
                this._notifyPvd.closeLoading();
                this._notifyPvd.showInfo('Meal added to favorites successfully!');
                this._navCtrl.pop();
              })
              .catch((err: firebase.FirebaseError) => {
                this._notifyPvd.showError(err.message);
              });
          }
        }
      ]
    }).present();
  }

  public changeFood(idx: number): void {
    this._actionSheetCtrl.create({
      title: 'Change food',
      buttons: [
        {
          text: 'Change quantity',
          handler: () => {
            this._changeQuantity(this.meal.foods[idx]);
          }
        }, {
          text: 'Remove it',
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
    this._notifyPvd.showLoading();
    this._diet.meals = [...this._diet.meals.slice(0, this._mealIdx), ...this._diet.meals.slice(this._mealIdx + 1)];
    this._diet.nourishment = this._dietPvd.calculateNourishment(this._diet.meals);
    this._userPvd.getUserProfile$(this._authId).subscribe((u: UserProfile) => {
      this._dietPvd.calculateRequirement(u.age, u.constitution, u.gender, u.isLactating, u.isPregnant, u.measurements.weight)
        .then((r: NutritionalValues) => {
          this._diet.nourishmentAchieved = this._dietPvd.calculateNourishmentFromRequirement(this._diet.nourishment, r);
          this._dietPvd.saveDiet(this._authId, this._diet, this._trends)
            .then(() => {
              this._notifyPvd.closeLoading();
              this._notifyPvd.showInfo('Meal removed successfully!');
              this._navCtrl.pop();
            })
            .catch((err: firebase.FirebaseError) => {
              this._notifyPvd.showError(err.message);
            });
        })
    }, (err: Error) => {
      this._notifyPvd.showError(err.message);
    });
  }

  public saveMeal(): void {
    this._notifyPvd.showLoading();
    this.meal.nourishment = this._dietPvd.calculateNourishment(this.meal.foods);
    this.meal.quantity = this.meal.foods.reduce((quantity: number, food: Food) => quantity + food.quantity, 0);
    this._diet.meals = [...this._diet.meals.slice(0, this._mealIdx), this.meal, ...this._diet.meals.slice(this._mealIdx + 1)];
    this._diet.nourishment = this._dietPvd.calculateNourishment(this._diet.meals);
    this._userPvd.getUserProfile$(this._authId).subscribe((u: UserProfile) => {
      this._dietPvd.calculateRequirement(u.age, u.constitution, u.gender, u.isLactating, u.isPregnant, u.measurements.weight)
        .then((r: NutritionalValues) => {
          this._diet.nourishmentAchieved = this._dietPvd.calculateNourishmentFromRequirement(this._diet.nourishment, r);
          this._dietPvd.saveDiet(this._authId, this._diet, this._trends)
            .then(() => {
              this._notifyPvd.closeLoading();
              this._notifyPvd.showInfo('Diet saved successfully!');
              this._navCtrl.pop();
            })
            .catch((err: firebase.FirebaseError) => {
              this._notifyPvd.showError(err.message);
            })
        })
    }, (err: Error) => {
      this._notifyPvd.showError(err.message);
    });
  }
}
