// Angular
import { Component } from '@angular/core';

// Ionic
import {
  AlertController,
  IonicPage,
  NavParams,
  ViewController
} from 'ionic-angular';

@IonicPage({
  name: 'rewards'
})
@Component({
  templateUrl: 'rewards.html',
})
export class RewardsPage {
  public context: string;
  public goalsAchieved: boolean;
  public goodQuality: boolean;
  public lifepoints: number;
  constructor(
    private _params: NavParams,
    private _viewCtrl: ViewController
  ) {
    this.context = <string>this._params.get('context');
    this.goalsAchieved = <boolean>this._params.get('goalsAchieved');
    this.goodQuality = <boolean>this._params.get('goodQuality');
    this.lifepoints = <number>this._params.get('lifepoints');
  }

  public dismiss(): void {
    this._viewCtrl.dismiss();
  }
}
