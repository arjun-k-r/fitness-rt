import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { RecipeProvider } from './recipe';
import { NutritionProviderModule } from '../nutrition/nutrition.module';

@NgModule({
  imports: [
    IonicPageModule.forChild(RecipeProvider),
    NutritionProviderModule
  ],
  providers: [
    RecipeProvider
  ]
})
export class RecipeProviderModule {}
