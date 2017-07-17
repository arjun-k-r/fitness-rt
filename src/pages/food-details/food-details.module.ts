// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Pages
import { FoodDetailsPage } from './food-details';

// Providers
import { FoodServiceModule } from '../../providers';

@NgModule({
  declarations: [
    FoodDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(FoodDetailsPage),
    FoodServiceModule
  ],
  exports: [
    FoodDetailsPage
  ]
})
export class FoodDetailsPageModule {}
