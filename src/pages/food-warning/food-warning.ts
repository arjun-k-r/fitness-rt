// Angular
import { Component } from '@angular/core';

// Ionic
import {
  IonicPage,
  NavParams,
  ViewController
} from 'ionic-angular';

// Models
import { Food } from '../../models';

@IonicPage({
  name: 'food-warning'
})
@Component({
  templateUrl: 'food-warning.html',
})
export class FoodWarningPage {
  public antinutrientFoods: Food[];
  public intoleratedFoods: Food[];
  constructor(
    private _params: NavParams,
    private _viewCtrl: ViewController
  ) {
    this.antinutrientFoods = <Food[]>this._params.get('antinutrientFoods');
    this.intoleratedFoods = <Food[]>this._params.get('intoleratedFoods');
  }

  public dismiss(): void {
    this._viewCtrl.dismiss();
  }

}
