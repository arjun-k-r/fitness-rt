import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Pages
import { FoodListPage } from './food-list';

// Providers
import { FoodServiceModule } from '../../providers';

@NgModule({
  declarations: [
    FoodListPage,
  ],
  imports: [
    IonicPageModule.forChild(FoodListPage),
    FoodServiceModule
  ],
  exports: [
    FoodListPage
  ]
})
export class FoodListPageModule {}
