// Angular
import { Component } from '@angular/core';

// Ionic
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';

import { Constitution } from '../../../models';

@IonicPage({
  name: 'food-guidelines'
})
@Component({
  templateUrl: 'food-guidelines.html',
})
export class FoodGuidelinesPage {
  public constitution: Constitution;
  public pageSegment: string = 'Vata';
  public singleDosha: boolean = false;
  constructor(private _navCtrl: NavController, private _params: NavParams) {
    /*
    this.constitution = <Constitution>this._params.get('constitution') || new Constitution();
    if (!this.constitution.dominantDosha) {
      this._navCtrl.setRoot('diet');
    }
    this.pageSegment = this.constitution.dominantDosha;
    if (this.constitution.dominantDosha === 'Vata' || this.constitution.dominantDosha === 'Pitta' || this.constitution.dominantDosha === 'Kapha') {
      this.singleDosha = true;
    }
    */
  }


}
