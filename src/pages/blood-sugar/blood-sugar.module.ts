import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ChartsModule } from 'ng2-charts';

import { BloodSugarPage } from './blood-sugar';
import { BloodSugarProviderModule } from '../../providers';

@NgModule({
  declarations: [
    BloodSugarPage,
  ],
  imports: [
    IonicPageModule.forChild(BloodSugarPage),
    BloodSugarProviderModule,
    ChartsModule
  ],
})
export class BloodSugarPageModule {}
