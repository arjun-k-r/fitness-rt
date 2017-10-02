import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { FoodIntolerancePage } from './food-intolerance';
import { FoodProviderModule } from '../../providers';

@NgModule({
  declarations: [
    FoodIntolerancePage,
  ],
  imports: [
    IonicPageModule.forChild(FoodIntolerancePage),
    FoodProviderModule
  ],
})
export class FoodIntolerancePageModule {}
