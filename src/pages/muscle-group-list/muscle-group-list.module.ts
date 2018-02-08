import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { MuscleGroupListPage } from './muscle-group-list';
import { ExerciseProviderModule } from '../../providers';

@NgModule({
  declarations: [
    MuscleGroupListPage,
  ],
  imports: [
    IonicPageModule.forChild(MuscleGroupListPage),
    ExerciseProviderModule
  ],
})
export class MuscleGroupListPageModule {}
