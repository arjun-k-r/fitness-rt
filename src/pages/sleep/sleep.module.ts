import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { SleepPage } from './sleep';
import { SleepProviderModule } from '../../providers'

@NgModule({
  declarations: [
    SleepPage,
  ],
  imports: [
    IonicPageModule.forChild(SleepPage),
    SleepProviderModule
  ],
})
export class SleepPageModule {}
