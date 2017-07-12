// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { FoodService } from './food.service';

@NgModule({
  imports: [
    IonicPageModule.forChild(FoodService),
  ],
  providers: [
    FoodService
  ]
})
export class FoodServiceModule {}
