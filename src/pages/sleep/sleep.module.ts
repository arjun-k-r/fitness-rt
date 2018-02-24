import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ChartsModule } from 'ng2-charts';

import { SleepPage } from './sleep';
import { SleepProviderModule, UserProfileProviderModule } from '../../providers'

@NgModule({
  declarations: [
    SleepPage,
  ],
  imports: [
    IonicPageModule.forChild(SleepPage),
    SleepProviderModule,
    ChartsModule,
    UserProfileProviderModule
  ],
})
export class SleepPageModule {}