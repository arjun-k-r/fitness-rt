// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { FoodService } from './food.service';
import { NutritionServiceModule } from '../nutrition/nutrition-service.module';

@NgModule({
  imports: [
    IonicPageModule.forChild(FoodService),
    NutritionServiceModule
  ],
  providers: [
    FoodService
  ]
})
export class FoodServiceModule {}
