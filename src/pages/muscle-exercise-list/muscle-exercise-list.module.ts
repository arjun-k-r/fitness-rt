import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { MuscleExerciseListPage } from './muscle-exercise-list';
import { ExerciseProviderModule } from '../../providers';

@NgModule({
  declarations: [
    MuscleExerciseListPage,
  ],
  imports: [
    IonicPageModule.forChild(MuscleExerciseListPage),
    ExerciseProviderModule
  ],
})
export class MuscleExerciseListPageModule {}
