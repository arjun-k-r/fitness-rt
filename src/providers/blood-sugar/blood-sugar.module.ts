import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { BloodSugarProvider } from './blood-sugar';

@NgModule({
  imports: [
    IonicPageModule.forChild(BloodSugarProvider)
  ],
  providers: [
    BloodSugarProvider
  ]
})
export class BloodSugarProviderModule {}
