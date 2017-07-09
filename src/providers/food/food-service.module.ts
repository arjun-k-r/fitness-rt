import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { FOOD_GROUPS, FoodService } from './food.service';

@NgModule({
  declarations: [
    FoodService,
  ],
  imports: [
    IonicPageModule.forChild(FoodService),
  ],
  exports: [
    FOOD_GROUPS,
    FoodService
  ]
})
export class FoodServiceModule {}
