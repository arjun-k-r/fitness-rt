// Angular
import { Component } from '@angular/core';

// Ionic
import {
  AlertController,
  IonicPage,
  NavParams,
  ViewController
} from 'ionic-angular';

// Models
import { Food } from '../../models';

@IonicPage({
  name: 'food-intolerance'
})
@Component({
  templateUrl: 'food-intolerance.html',
})
export class FoodIntolerancePage {
  public foods: Food[];
  constructor(
    private _params: NavParams,
    private _viewCtrl: ViewController
  ) {
    this.foods = <Food[]>this._params.get('foods');
  }

  public dismiss(): void {
    this._viewCtrl.dismiss();
  }
}
