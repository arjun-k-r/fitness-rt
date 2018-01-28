import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { DietProvider } from './diet';
import { ExerciseProviderModule } from '../exercise/exercise.module';

@NgModule({
  imports: [
    IonicPageModule.forChild(DietProvider),
    ExerciseProviderModule
  ],
  providers: [
    DietProvider
  ]
})
export class DietProviderModule {}