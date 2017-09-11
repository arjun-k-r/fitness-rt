import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { FoodDetailsPage } from './food-details';
import { FoodProviderModule } from '../../providers';

@NgModule({
  declarations: [
    FoodDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(FoodDetailsPage),
    FoodProviderModule
  ],
})
export class FoodDetailsPageModule {}
