import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { SleepProvider } from './sleep';

@NgModule({
  imports: [
    IonicPageModule.forChild(SleepProvider)
  ],
  providers: [
    SleepProvider
  ]
})
export class SleepProviderModule {}
