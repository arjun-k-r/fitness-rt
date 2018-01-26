import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoodGuidelinesPage } from './food-guidelines';

@NgModule({
  declarations: [
    FoodGuidelinesPage,
  ],
  imports: [
    IonicPageModule.forChild(FoodGuidelinesPage),
  ],
})
export class FoodGuidelinesPageModule {}
