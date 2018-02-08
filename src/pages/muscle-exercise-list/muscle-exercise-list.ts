// Angular
import { Component } from '@angular/core';

// Ionic
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Models
import { IMuscle, IMuscleExercise } from '../../models';

// Providers
import { ExerciseProvider, NotificationProvider } from '../../providers';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';

@IonicPage({
  name: 'muscle-exercise-list'
})
@Component({
  templateUrl: 'muscle-exercise-list.html',
})
export class MuscleExerciseListPage {
  public muscle: IMuscle;
  constructor(private _navCtrl: NavController, private _params: NavParams) {
    this.muscle = this._params.get('muscle');
  }

  public openDetails(exercise: IMuscleExercise): void {
    this._navCtrl.push('muscle-exercise-details', { exercise });
  }

}
