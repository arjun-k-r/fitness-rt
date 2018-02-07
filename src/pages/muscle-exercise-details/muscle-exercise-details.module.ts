import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MuscleExerciseDetailsPage } from './muscle-exercise-details';

@NgModule({
  declarations: [
    MuscleExerciseDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MuscleExerciseDetailsPage),
  ],
})
export class MuscleExerciseDetailsPageModule {}
