// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Page
import { MealPlanPage } from './meal-plan';

// Providers
import { FitnessServiceModule, MealServiceModule, NutritionServiceModule } from '../../providers';

@NgModule({
  declarations: [
    MealPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(MealPlanPage),
    FitnessServiceModule,
    MealServiceModule,
    NutritionServiceModule
  ],
  exports: [
    MealPlanPage
  ]
})
export class MealDetailsPageModule {}
