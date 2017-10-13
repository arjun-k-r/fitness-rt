import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { BloodPressureProvider } from './blood-pressure';
import { FitnessProviderModule } from '../fitness/fitness.module';

@NgModule({
  imports: [
    IonicPageModule.forChild(BloodPressureProvider)
  ],
  providers: [
    BloodPressureProvider,
    FitnessProviderModule
  ]
})
export class BloodPressureProviderModule {}
