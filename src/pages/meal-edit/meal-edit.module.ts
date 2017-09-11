import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { MealEditPage } from './meal-edit';
import { MealProviderModule } from '../../providers';

@NgModule({
  declarations: [
    MealEditPage
  ],
  imports: [
    IonicPageModule.forChild(MealEditPage),
    MealProviderModule
  ],
})
export class MealEditPageModule {}
