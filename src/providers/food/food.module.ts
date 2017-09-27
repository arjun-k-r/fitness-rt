import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { FoodProvider } from './food';
import { NutritionProviderModule } from '../nutrition/nutrition.module';

@NgModule({
  imports: [
    IonicPageModule.forChild(FoodProvider),
    NutritionProviderModule
  ],
  providers: [
    FoodProvider
  ]
})
export class FoodProviderModule {}
