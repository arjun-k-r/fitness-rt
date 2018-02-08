import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { MuscleExerciseListPage } from './muscle-exercise-list';

@NgModule({
  declarations: [
    MuscleExerciseListPage
  ],
  imports: [
    IonicPageModule.forChild(MuscleExerciseListPage)
  ],
})
export class MuscleExerciseListPageModule {}
