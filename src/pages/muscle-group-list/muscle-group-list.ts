// Angular
import { Component } from '@angular/core';

// Ionic
import { IonicPage, NavController } from 'ionic-angular';

// Models
import { IMuscleGroup, MuscleExercise } from '../../models';

// Providers
import { ExerciseProvider } from '../../providers';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';

@IonicPage({
  name: 'muscle-group-list'
})
@Component({
  templateUrl: 'muscle-group-list.html',
})
export class MuscleGroupListPage {
  public muscleGroups$: FirebaseListObservable<IMuscleGroup[]>;
  constructor(
    private _exercisePvd: ExerciseProvider,
    private _navCtrl: NavController
  ) {
  }

  public openDetails(exercise: MuscleExercise): void {
    this._navCtrl.push('muscle-exercise-details', { exercise });
  }

  ionViewWillEnter(): void {
    this.muscleGroups$ = this._exercisePvd.getMuscleGroupExercises$();
  }

}
