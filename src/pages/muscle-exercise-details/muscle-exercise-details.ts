// Angular
import { Component } from '@angular/core';

// Ionic
import { IonicPage, NavParams, NavController } from 'ionic-angular';

// Models
import { IMuscleExercise } from '../../models';

@IonicPage({
  name: 'muscle-exercise-details'
})
@Component({
  templateUrl: 'muscle-exercise-details.html',
})
export class MuscleExerciseDetailsPage {
  public exercise: IMuscleExercise;
  constructor(private _navCtrl: NavController, private _params: NavParams) {
    this.exercise = this._params.get('exercise');
    if (!this.exercise) {
      this._navCtrl.setRoot('exercise');
    }
  }
}
