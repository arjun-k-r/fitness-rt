import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { FoodProvider } from './food';

@NgModule({
  imports: [
    IonicPageModule.forChild(FoodProvider),
  ],
  providers: [
    FoodProvider
  ]
})
export class FoodProviderModule {}
