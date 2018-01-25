// Angular
import { Component } from '@angular/core';

// Ionic
import {
  IonicPage,
  NavParams
} from 'ionic-angular';

import { Constitution } from '../../models';

@IonicPage()
@Component({
  selector: 'page-food-guidelines',
  templateUrl: 'food-guidelines.html',
})
export class FoodGuidelinesPage {
  public constitution: Constitution;
  constructor(private _params: NavParams) {
    this.constitution = <Constitution>this._params.get('constitution')
  }
  

}
