// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Pages
import { FoodListPage } from './food-list';

// Pipes
import { LimitPipeModule, SearchPipeModule, SortByPipeModule } from '../../pipes';

// Providers
import { FoodServiceModule } from '../../providers';

@NgModule({
  declarations: [
    FoodListPage,
  ],
  imports: [
    IonicPageModule.forChild(FoodListPage),
    FoodServiceModule,
    LimitPipeModule,
    SearchPipeModule,
    SortByPipeModule
  ],
  exports: [
    FoodListPage
  ]
})
export class FoodListPageModule {}
