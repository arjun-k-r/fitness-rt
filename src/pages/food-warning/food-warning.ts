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
  name: 'food-warning'
})
@Component({
  templateUrl: 'food-warning.html',
})
export class FoodWarningPage {
  public foods: Food[];
  public warningView: string;
  constructor(
    private _params: NavParams,
    private _viewCtrl: ViewController
  ) {
    this.foods = <Food[]>this._params.get('foods');
    this.warningView = <string>this._params.get('warning');
  }

  public dismiss(): void {
    this._viewCtrl.dismiss();
  }

}
