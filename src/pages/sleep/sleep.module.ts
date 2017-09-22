import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ChartsModule } from 'ng2-charts';

import { SleepPage } from './sleep';
import { SleepProviderModule } from '../../providers'

@NgModule({
  declarations: [
    SleepPage,
  ],
  imports: [
    IonicPageModule.forChild(SleepPage),
    ChartsModule,
    SleepProviderModule
  ],
})
export class SleepPageModule {}
