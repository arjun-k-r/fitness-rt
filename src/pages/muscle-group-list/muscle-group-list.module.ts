import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { MuscleGroupListPage } from './muscle-group-list';
import { PhysicalActivityProviderModule } from '../../providers';

@NgModule({
  declarations: [
    MuscleGroupListPage,
  ],
  imports: [
    IonicPageModule.forChild(MuscleGroupListPage),
    PhysicalActivityProviderModule
  ],
})
export class MuscleGroupListPageModule {}
