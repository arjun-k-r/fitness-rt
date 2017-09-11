import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ExercisePage } from './exercise';
import { ActivityProviderModule } from '../../providers';

@NgModule({
  declarations: [
    ExercisePage,
  ],
  imports: [
    IonicPageModule.forChild(ExercisePage),
    ActivityProviderModule
  ],
})
export class ExercisePageModule {}
