import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { FoodDetailsPage } from './food-details';
import { DietProviderModule, FoodProviderModule, UserProfileProviderModule } from '../../providers';

@NgModule({
  declarations: [
    FoodDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(FoodDetailsPage),
    FoodProviderModule,
    UserProfileProviderModule,
    DietProviderModule
  ],
})
export class FoodDetailsPageModule {}
