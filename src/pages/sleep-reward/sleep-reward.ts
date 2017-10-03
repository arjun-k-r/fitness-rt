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
  name: 'sleep-reward'
})
@Component({
  templateUrl: 'sleep-reward.html',
})
export class SleepRewardPage {
  public goalsAchieved: boolean;
  public goodSleep: boolean;
  public lifepoints: number;
  constructor(
    private _params: NavParams,
    private _viewCtrl: ViewController
  ) {
    this.goalsAchieved = <boolean>this._params.get('goalsAchieved');
    this.goodSleep = <boolean>this._params.get('goodSleep');
    this.lifepoints = <number>this._params.get('lifepoints');
  }

  public dismiss(): void {
    this._viewCtrl.dismiss();
  }
}
