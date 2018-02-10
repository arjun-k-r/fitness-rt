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
  name: 'exercise-guidelines'
})
@Component({
  templateUrl: 'exercise-guidelines.html',
})
export class ExerciseGuidelinesPage {
  public constitution: Constitution;
  constructor(private _navCtrl: NavController, private _params: NavParams) {
    this.constitution = <Constitution>this._params.get('constitution') || new Constitution();
    if (!this.constitution.dominantDosha) {
      this._navCtrl.setRoot('exercise');
    }
  }


}
