import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { NutritionProvider } from './nutrition';
import { ActivityProviderModule } from '../activity/activity.module';

@NgModule({
  imports: [
    IonicPageModule.forChild(NutritionProvider),
    ActivityProviderModule
  ],
  providers: [
    NutritionProvider
  ]
})
export class NutritionProviderModule {}
