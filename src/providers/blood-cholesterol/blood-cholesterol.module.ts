import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { BloodCholesterolProvider } from './blood-cholesterol';

@NgModule({
  imports: [
    IonicPageModule.forChild(BloodCholesterolProvider)
  ],
  providers: [
    BloodCholesterolProvider
  ]
})
export class BloodCholesterolProviderModule {}
