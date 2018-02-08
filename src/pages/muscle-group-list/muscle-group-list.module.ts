import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MuscleGroupListPage } from './muscle-group-list';

@NgModule({
  declarations: [
    MuscleGroupListPage,
  ],
  imports: [
    IonicPageModule.forChild(MuscleGroupListPage),
  ],
})
export class MuscleGroupListPageModule {}
