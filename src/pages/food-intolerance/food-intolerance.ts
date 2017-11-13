// Angular
import { Component } from '@angular/core';

// Ionic
import {
  AlertController,
  IonicPage,
  Modal,
  ModalController,
  NavParams,
  ViewController
} from 'ionic-angular';

// Firebase
import * as firebase from 'firebase/app';

// Models
import { Food, Recipe } from '../../models';

// Providers
import { MealProvider } from '../../providers';

@IonicPage({
  name: 'food-intolerance'
})
@Component({
  templateUrl: 'food-intolerance.html',
})
export class FoodIntolerancePage {
  private _authId: string;
  public foods: Food[];
  constructor(
    private _alertCtrl: AlertController,
    private _mealPvd: MealProvider,
    private _modalCtrl: ModalController,
    private _params: NavParams,
    private _viewCtrl: ViewController
  ) {
    this._authId = this._params.get('authId');
    this.foods = <Food[]>this._params.get('foods');
  }

  public addFood(): void {
    const foodListModal: Modal = this._modalCtrl.create('food-list', { authId: this._authId });
    foodListModal.present();
    foodListModal.onDidDismiss((foods: (Food | Recipe)[]) => {
      if (!!foods) {
        foods.forEach((food: (Food | Recipe)) => {
          if (food.hasOwnProperty('chef')) {
            this.foods = [...this.foods, ...this._mealPvd.getRecipeFoods([], [food])];
          } else {
            this.foods = [...this.foods, <Food>food];
          }
        });
      }
    });
  }

  public dismiss(): void {
    this._viewCtrl.dismiss();
  }

  public removeFood(idx: number): void {
    this.foods = [...this.foods.slice(0, idx), ...this.foods.slice(idx + 1)];
  }

  public save(): void {
    this._mealPvd.saveIntoleratedFoods(this._authId, this.foods)
    .then(() => this._viewCtrl.dismiss())
    .catch((err: firebase.FirebaseError) => {
      this._alertCtrl.create({
        title: 'Uhh ohh...',
        subTitle: 'Something went wrong',
        message: err.message,
        buttons: ['OK']
      }).present();
    })
  }
}
