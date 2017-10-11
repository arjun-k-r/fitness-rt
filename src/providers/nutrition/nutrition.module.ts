import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { NutritionProvider } from './nutrition';

@NgModule({
  imports: [
    IonicPageModule.forChild(NutritionProvider)
  ],
  providers: [
    NutritionProvider
  ]
})
export class NutritionProviderModule {}
