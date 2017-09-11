import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { FoodListPage } from './food-list';
import { LimitPipeModule, SearchPipeModule, SortByPipeModule } from '../../pipes';
import { FoodProviderModule, RecipeProviderModule } from '../../providers';

@NgModule({
  declarations: [
    FoodListPage
  ],
  imports: [
    IonicPageModule.forChild(FoodListPage),
    FoodProviderModule,
    LimitPipeModule,
    RecipeProviderModule,
    SearchPipeModule,
    SortByPipeModule
  ],
})
export class FoodListPageModule {}
