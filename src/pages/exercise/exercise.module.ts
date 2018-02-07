import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';
import { MaterialIconsModule } from 'ionic2-material-icons';

import { ChartsModule } from 'ng2-charts';

import { ExercisePage } from './exercise';
import { ExerciseProviderModule, UserProfileProviderModule } from '../../providers';

@NgModule({
  declarations: [
    ExercisePage,
  ],
  imports: [
    IonicPageModule.forChild(ExercisePage),
    ChartsModule,
    ExerciseProviderModule,
    MaterialIconsModule,
    UserProfileProviderModule
  ],
})
export class ExercisePageModule {}
