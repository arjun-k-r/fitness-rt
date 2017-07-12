// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { NutritionService } from './nutrition.service';

@NgModule({
  imports: [
    IonicPageModule.forChild(NutritionService),
  ],
  providers: [
    NutritionService
  ]
})
export class NutritionServiceModule {}
