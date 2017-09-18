import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { MealProvider } from './meal';
import { FitnessProviderModule } from '../fitness/fitness.module';

@NgModule({
  imports: [
    IonicPageModule.forChild(MealProvider)
  ],
  providers: [
    MealProvider,
    FitnessProviderModule
  ]
})
export class MealProviderModule {}
