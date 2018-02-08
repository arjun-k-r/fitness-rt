// Angular
import { Component } from '@angular/core';

// Ionic
import { IonicPage, NavParams } from 'ionic-angular';

// Models
import { IMuscle } from '../../models';

@IonicPage({
  name: 'muscle-exercise-details'
})
@Component({
  templateUrl: 'muscle-exercise-details.html',
})
export class MuscleExerciseDetailsPage {
  public muscle: IMuscle;
  constructor(private _params: NavParams) {
    this.muscle = this._params.get('muscle');
  }
}
