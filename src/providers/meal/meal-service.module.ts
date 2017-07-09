import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MealService } from './meal.service';

@NgModule({
  declarations: [
    MealService,
  ],
  imports: [
    IonicPageModule.forChild(MealService),
  ],
  exports: [
    MealService
  ]
})
export class MealServiceModule {}
