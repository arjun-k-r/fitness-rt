// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { MealService } from './meal.service';

@NgModule({
  imports: [
    IonicPageModule.forChild(MealService),
  ],
  providers: [
    MealService
  ]
})
export class MealServiceModule {}
