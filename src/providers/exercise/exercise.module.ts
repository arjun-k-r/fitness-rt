import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ExerciseProvider } from './exercise';

@NgModule({
  imports: [
    IonicPageModule.forChild(ExerciseProvider)
  ],
  providers: [
    ExerciseProvider
  ]
})
export class ExerciseProviderModule {}