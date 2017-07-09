import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { NutritionService } from './nutrition.service';

@NgModule({
  declarations: [
    NutritionService,
  ],
  imports: [
    IonicPageModule.forChild(NutritionService),
  ],
  exports: [
    NutritionService
  ]
})
export class NutritionServiceModule {}
