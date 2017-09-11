import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { RecipeProvider } from './recipe';

@NgModule({
  imports: [
    IonicPageModule.forChild(RecipeProvider),
  ],
  providers: [
    RecipeProvider
  ]
})
export class RecipeProviderModule {}
