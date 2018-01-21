import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { MealDetailsPage } from './meal-details';
import { DietProviderModule, FoodProviderModule, UserProfileProviderModule } from '../../providers';

@NgModule({
  declarations: [
    MealDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MealDetailsPage),
    DietProviderModule,
    FoodProviderModule,
    UserProfileProviderModule
  ],
})
export class MealDetailsPageModule {}
