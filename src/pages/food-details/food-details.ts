// App
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Auth } from '@ionic/cloud-angular';

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
    private _auth: Auth,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this.food = _params.get('food');
  }

  ionViewCanEnter(): boolean {
    if (!this._auth.isAuthenticated()) {
      this._navCtrl.setRoot('registration');
      return false;
    }
  }
}