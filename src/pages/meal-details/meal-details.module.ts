// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Page
import { MealDetailsPage } from './meal-details';

// Providers
import { MealServiceModule, NutritionServiceModule } from '../../providers';

@NgModule({
  declarations: [
    MealDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MealDetailsPage),
    MealServiceModule,
    NutritionServiceModule
  ],
  exports: [
    MealDetailsPage
  ]
})
export class MealDetailsPageModule {}
