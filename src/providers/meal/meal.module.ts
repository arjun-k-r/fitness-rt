import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { MealProvider } from './meal';
import { NutritionProviderModule } from '../nutrition/nutrition.module';


@NgModule({
  imports: [
    IonicPageModule.forChild(MealProvider),
    NutritionProviderModule
  ],
  providers: [
    MealProvider
  ]
})
export class MealProviderModule {}
