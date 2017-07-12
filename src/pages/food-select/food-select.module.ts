// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Pages
import { FoodSelectPage } from './food-select';

// Pipes
import { LimitPipeModule, SearchPipeModule, SortByPipeModule } from '../../pipes';

// Providers
import { FoodServiceModule, RecipeServiceModule } from '../../providers';

@NgModule({
  declarations: [
    FoodSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(FoodSelectPage),
    FoodServiceModule,
    LimitPipeModule,
    RecipeServiceModule,
    SearchPipeModule,
    SortByPipeModule
  ],
  exports: [
    FoodSelectPage
  ]
})
export class FoodSelectPageModule {}
