// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { RecipeService } from './recipe.service';

@NgModule({
  imports: [
    IonicPageModule.forChild(RecipeService),
  ],
  providers: [
    RecipeService
  ]
})
export class RecipeServiceModule {}
