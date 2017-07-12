// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { MealService } from './meal.service';
import { NutritionServiceModule } from '../nutrition/nutrition-service.module';

@NgModule({
  imports: [
    IonicPageModule.forChild(MealService),
    NutritionServiceModule
  ],
  providers: [
    MealService
  ]
})
export class MealServiceModule {}
