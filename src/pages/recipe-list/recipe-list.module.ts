// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Pages
import { RecipeListPage } from './recipe-list';

// Providers
import { RecipeServiceModule } from '../../providers';

@NgModule({
  declarations: [
    RecipeListPage,
  ],
  imports: [
    IonicPageModule.forChild(RecipeListPage),
    RecipeServiceModule
  ],
  exports: [
    RecipeListPage
  ]
})
export class RecipeListPageModule {}
