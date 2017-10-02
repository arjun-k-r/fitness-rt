import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoodWarningPage } from './food-warning';

@NgModule({
  declarations: [
    FoodWarningPage,
  ],
  imports: [
    IonicPageModule.forChild(FoodWarningPage),
  ],
})
export class FoodWarningPageModule {}
