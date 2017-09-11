import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { RecipeListPage } from './recipe-list';
import { FilterPipeModule, LimitPipeModule, SearchPipeModule, SortByPipeModule } from '../../pipes';
import { RecipeProviderModule } from '../../providers';

@NgModule({
  declarations: [
    RecipeListPage
  ],
  imports: [
    IonicPageModule.forChild(RecipeListPage),
    RecipeProviderModule,
    FilterPipeModule,
    LimitPipeModule,
    SearchPipeModule,
    SortByPipeModule
  ],
})
export class RecipeListPageModule {}
