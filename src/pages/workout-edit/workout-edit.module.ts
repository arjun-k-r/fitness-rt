import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkoutEditPage } from './workout-edit';

@NgModule({
  declarations: [
    WorkoutEditPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkoutEditPage),
  ],
})
export class WorkoutEditPageModule {}
