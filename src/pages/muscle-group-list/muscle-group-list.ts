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
    private exercisePvd: ExerciseProvider,
    private navCtrl: NavController
  ) {
  }

  public openDetails(exercise: MuscleExercise): void {
    this.navCtrl.push('muscle-exercise-details', { exercise });
  }

  ionViewWillEnter(): void {
    this.muscleGroups$ = this.exercisePvd.getMuscleGroupExercises$();
  }

}
