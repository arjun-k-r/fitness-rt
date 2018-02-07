// Angular
import { Component } from '@angular/core';

// Ionic
import { IonicPage, NavController } from 'ionic-angular';

// Models
import { IMuscleGroup, IMuscle } from '../../models';

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
  public muscleGroups$: FirebaseListObservable<IMuscleGroup[]>;
  constructor(
    private _exercisePvd: ExerciseProvider,
    private _navCtrl: NavController,
    private _notifyPvd: NotificationProvider
  ) {
  }

  public openDetails(muscle: IMuscle): void {
    this._navCtrl.push('muscle-exercise-details', { muscle });
  }

  ionViewWillEnter(): void {
    this.muscleGroups$ = this._exercisePvd.getMuscleGroupExercises$();
  }

}
