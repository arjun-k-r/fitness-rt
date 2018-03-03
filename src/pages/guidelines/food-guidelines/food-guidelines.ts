// Angular
import { Component } from '@angular/core';

// Ionic
import {
  IonicPage,
  // NavController,
  // NavParams
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
  constructor(
    // private navCtrl: NavController, private params: NavParams
  ) {
    /*
    this.constitution = <Constitution>this.params.get('constitution') || new Constitution();
    if (!this.constitution.dominantDosha) {
      this.navCtrl.setRoot('diet');
    }
    this.pageSegment = this.constitution.dominantDosha;
    if (this.constitution.dominantDosha === 'Vata' || this.constitution.dominantDosha === 'Pitta' || this.constitution.dominantDosha === 'Kapha') {
      this.singleDosha = true;
    }
    */
  }


}
