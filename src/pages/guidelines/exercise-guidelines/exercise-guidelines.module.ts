import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExerciseGuidelinesPage } from './exercise-guidelines';

@NgModule({
  declarations: [
    ExerciseGuidelinesPage,
  ],
  imports: [
    IonicPageModule.forChild(ExerciseGuidelinesPage),
  ],
})
export class ExerciseGuidelinesPageModule {}
