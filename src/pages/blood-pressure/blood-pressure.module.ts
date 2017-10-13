import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ChartsModule } from 'ng2-charts';

import { BloodPressurePage } from './blood-pressure';
import { BloodPressureProviderModule, FitnessProviderModule } from '../../providers';

@NgModule({
  declarations: [
    BloodPressurePage,
  ],
  imports: [
    IonicPageModule.forChild(BloodPressurePage),
    BloodPressureProviderModule,
    ChartsModule,
    FitnessProviderModule
  ],
})
export class BloodPressurePageModule {}
