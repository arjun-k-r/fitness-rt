import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExerciseInfoPage } from './exercise-info';

@NgModule({
  declarations: [
    ExerciseInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ExerciseInfoPage),
  ],
})
export class ExerciseInfoPageModule {}
