import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ChartsModule } from 'ng2-charts';

import { NutritionPage } from './nutrition';
import { MealProviderModule } from '../../providers';

@NgModule({
  declarations: [
    NutritionPage,
  ],
  imports: [
    IonicPageModule.forChild(NutritionPage),
    ChartsModule,
    MealProviderModule
  ],
})
export class NutritionPageModule {}
