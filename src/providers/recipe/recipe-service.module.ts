// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { FoodServiceModule } from '../food/food-service.module';
import { NutritionServiceModule } from '../nutrition/nutrition-service.module';
import { RecipeService } from './recipe.service';

@NgModule({
  imports: [
    IonicPageModule.forChild(RecipeService),
    FoodServiceModule,
    NutritionServiceModule
  ],
  providers: [
    RecipeService
  ]
})
export class RecipeServiceModule {}
