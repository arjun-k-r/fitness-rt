import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { FoodProvider } from './food';
import { FitnessProviderModule } from '../fitness/fitness.module';

@NgModule({
  imports: [
    IonicPageModule.forChild(FoodProvider)
  ],
  providers: [
    FoodProvider,
    FitnessProviderModule
  ]
})
export class FoodProviderModule {}
