import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { FoodListPage } from './food-list';
import { SearchPipeModule, SortByPipeModule } from '../../pipes';
import { DietProviderModule, FoodProviderModule } from '../../providers';

@NgModule({
  declarations: [
    FoodListPage
  ],
  imports: [
    IonicPageModule.forChild(FoodListPage),
    DietProviderModule,
    FoodProviderModule,
    SearchPipeModule,
    SortByPipeModule
  ],
})
export class FoodListPageModule { }