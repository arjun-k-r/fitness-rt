import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { FitnessProvider } from './fitness';

@NgModule({
  imports: [
    IonicPageModule.forChild(FitnessProvider),
  ],
  providers: [
    FitnessProvider
  ]
})
export class FitnessProviderModule {}
