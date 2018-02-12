// Angular
import { Component } from '@angular/core';

// Ionic
import { IonicPage, NavParams, NavController } from 'ionic-angular';

// Models
import { MuscleExercise } from '../../models';

@IonicPage({
  name: 'muscle-exercise-details'
})
@Component({
  templateUrl: 'muscle-exercise-details.html',
})
export class MuscleExerciseDetailsPage {
  public exercise: MuscleExercise;
  constructor(private _navCtrl: NavController, private _params: NavParams) {
    this.exercise = this._params.get('exercise') || new MuscleExercise();
    if (!this.exercise.name) {
      this._navCtrl.setRoot('exercise');
    }
  }
}
