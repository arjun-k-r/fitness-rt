// App
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Food } from '../../models';

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
}