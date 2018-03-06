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
  name: 'physical-activity-guidelines'
})
@Component({
  templateUrl: 'physical-activity-guidelines.html',
})
export class PhysicalActivityGuidelinesPage {
  public constitution: Constitution;
  constructor(private navCtrl: NavController, private params: NavParams) {
    this.constitution = <Constitution>this.params.get('constitution') || new Constitution();
    if (!this.constitution.dominantDosha) {
      this.navCtrl.setRoot('physical-activity');
    }
  }


}
