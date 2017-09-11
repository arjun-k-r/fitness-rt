import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { FitnessPage } from './fitness';
import { FitnessProviderModule, NutritionProviderModule } from '../../providers';

@NgModule({
  declarations: [
    FitnessPage,
  ],
  imports: [
    IonicPageModule.forChild(FitnessPage),
    FitnessProviderModule,
    NutritionProviderModule
  ],
})
export class FitnessPageModule {}
