import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MealEditPage } from './meal-edit';

@NgModule({
  declarations: [
    MealEditPage,
  ],
  imports: [
    IonicPageModule.forChild(MealEditPage),
  ],
})
export class MealEditPageModule {}
