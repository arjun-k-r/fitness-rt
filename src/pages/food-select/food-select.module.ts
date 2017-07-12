// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Pages
import { FoodSelectPage } from './food-select';

// Providers
import { FoodServiceModule, RecipeServiceModule } from '../../providers';

@NgModule({
  declarations: [
    FoodSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(FoodSelectPage),
    FoodServiceModule,
    RecipeServiceModule
  ],
  exports: [
    FoodSelectPage
  ]
})
export class FoodSelectPageModule {}
