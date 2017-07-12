// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Pages
import { RecipeListPage } from './recipe-list';

// Pipes
import { FilterPipeModule, LimitPipeModule, SearchPipeModule } from '../../pipes';

// Providers
import { RecipeServiceModule } from '../../providers';

@NgModule({
  declarations: [
    RecipeListPage,
  ],
  imports: [
    IonicPageModule.forChild(RecipeListPage),
    FilterPipeModule,
    LimitPipeModule,
    RecipeServiceModule,
    SearchPipeModule
  ],
  exports: [
    RecipeListPage
  ]
})
export class RecipeListPageModule {}
