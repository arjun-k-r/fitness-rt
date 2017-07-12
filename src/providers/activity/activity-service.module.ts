// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { ActivityService } from './activity.service';
import { FitnessServiceModule } from '../fitness/fitness-service.module';
import { MealServiceModule } from '../meal/meal-service.module';
import { NutritionServiceModule } from '../nutrition/nutrition-service.module';

@NgModule({
  imports: [
    IonicPageModule.forChild(ActivityService),
    FitnessServiceModule,
    MealServiceModule,
    NutritionServiceModule
  ],
  providers: [
    ActivityService
  ]
})
export class ActivityServiceModule {}
