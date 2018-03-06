import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { DietProvider } from './diet';
import { PhysicalActivityProviderModule } from '../physical-activity/physical-activity.module';

@NgModule({
  imports: [
    IonicPageModule.forChild(DietProvider),
    PhysicalActivityProviderModule
  ],
  providers: [
    DietProvider
  ]
})
export class DietProviderModule {}