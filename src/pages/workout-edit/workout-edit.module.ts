import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { WorkoutEditPage } from './workout-edit';
import { PhysicalActivityProviderModule } from '../../providers';

@NgModule({
  declarations: [
    WorkoutEditPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkoutEditPage),
    PhysicalActivityProviderModule
  ],
})
export class WorkoutEditPageModule {}
