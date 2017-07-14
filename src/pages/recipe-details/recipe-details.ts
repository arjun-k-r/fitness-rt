import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Auth } from '@ionic/cloud-angular';

@IonicPage({
  name: 'recipe-details',
  segment: 'details:/name'
})
@Component({
  selector: 'page-recipe-details',
  templateUrl: 'recipe-details.html',
})
export class RecipeDetailsPage {
  constructor(
    private _auth: Auth,
    private _navCtrl: NavController,
    private _params: NavParams
  ) { }

  ionViewCanEnter(): boolean {
    if (!this._auth.isAuthenticated()) {
      this._navCtrl.setRoot('registration');
      return false;
    }
  }
}
