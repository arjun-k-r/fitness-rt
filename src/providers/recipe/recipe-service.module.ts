import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { RecipeService } from './recipe.service';

@NgModule({
  declarations: [
    RecipeService,
  ],
  imports: [
    IonicPageModule.forChild(RecipeService),
  ],
  exports: [
    RecipeService
  ]
})
export class RecipeServiceModule {}
