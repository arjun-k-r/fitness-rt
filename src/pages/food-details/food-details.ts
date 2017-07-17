// App
import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Food, Nutrition } from '../../models';

// Providers
import { FoodService } from '../../providers';

@IonicPage({
  name: 'food-details',
  segment: 'food-details/:id'
})
@Component({
  selector: 'page-food-details',
  templateUrl: 'food-details.html'
})
export class FoodDetailsPage {
  public food: Food;
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _foodSvc: FoodService,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this.food = _params.get('food');
  }

  ionViewCanEnter(): void {
    this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!auth) {
        this._navCtrl.setRoot('registration', {
          history: 'food-details'
        });
      }
    })
  }

  ionViewWillEnter(): void {
    this._foodSvc.calculateFoodNutrition(this.food)
      .then((nutrition: Nutrition) => this.food.nutrition = nutrition)
      .catch((err: Error) => {
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.toString(),
          buttons: ['OK']
        }).present();
      });
  }
}