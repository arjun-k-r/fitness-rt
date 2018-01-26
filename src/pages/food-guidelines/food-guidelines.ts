// Angular
import { Component } from '@angular/core';

// Ionic
import {
  IonicPage,
  NavParams
} from 'ionic-angular';

import { Constitution } from '../../models';

@IonicPage({
  name: 'food-guidelines'
})
@Component({
  templateUrl: 'food-guidelines.html',
})
export class FoodGuidelinesPage {
  public constitution: Constitution;
  public pageSegment: string;
  public singleDosha: boolean;
  constructor(private _params: NavParams) {
    this.constitution = <Constitution>this._params.get('constitution');
    this.pageSegment = this.constitution.dominantDosha;
    console.log(this.pageSegment)
    if (this.constitution.dominantDosha === 'Vata' || this.constitution.dominantDosha === 'Pitta'  || this.constitution.dominantDosha === 'Kapha' ) {
      this.singleDosha = true;
    }
  }


}
