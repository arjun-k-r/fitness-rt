import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { RecipeDetailsPage } from './recipe-details';
import { PictureProviderModule, RecipeProviderModule } from '../../providers';

@NgModule({
  declarations: [
    RecipeDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(RecipeDetailsPage),
    PictureProviderModule,
    RecipeProviderModule
  ],
})
export class RecipeDetailsPageModule {}
