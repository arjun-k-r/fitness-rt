import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { NutritionPage } from './nutrition';
import { MealProviderModule } from '../../providers';

@NgModule({
  declarations: [
    NutritionPage,
  ],
  imports: [
    IonicPageModule.forChild(NutritionPage),
    MealProviderModule
  ],
})
export class NutritionPageModule {}
