import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ChartsModule } from 'ng2-charts';

import { ExercisePage } from './exercise';
import { ActivityProviderModule } from '../../providers';

@NgModule({
  declarations: [
    ExercisePage,
  ],
  imports: [
    IonicPageModule.forChild(ExercisePage),
    ChartsModule,
    ActivityProviderModule
  ],
})
export class ExercisePageModule {}
