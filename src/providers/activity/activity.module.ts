import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ActivityProvider } from './activity';
import { FitnessProviderModule } from '../fitness/fitness.module';
import { NutritionProviderModule } from '../nutrition/nutrition.module';

@NgModule({
  imports: [
    IonicPageModule.forChild(ActivityProvider),
    FitnessProviderModule,
    NutritionProviderModule
  ],
  providers: [
    ActivityProvider
  ]
})
export class ActivityProviderModule {}
