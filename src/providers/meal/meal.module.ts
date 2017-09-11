import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { MealProvider } from './meal';

@NgModule({
  imports: [
    IonicPageModule.forChild(MealProvider)
  ],
  providers: [
    MealProvider
  ]
})
export class MealProviderModule {}
