import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { FoodIntolerancePage } from './food-intolerance';
import { FoodProviderModule, MealProviderModule } from '../../providers';

@NgModule({
  declarations: [
    FoodIntolerancePage,
  ],
  imports: [
    IonicPageModule.forChild(FoodIntolerancePage),
    FoodProviderModule,
    MealProviderModule
  ],
})
export class FoodIntolerancePageModule {}
