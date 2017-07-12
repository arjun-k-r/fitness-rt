// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Components
import { ErrorMessageComponentModule } from '../../components';

// Pages
import { RecipeEditPage } from './recipe-edit';

// Providers
import { NutritionServiceModule, PictureServiceModule, RecipeServiceModule } from '../../providers';

@NgModule({
  declarations: [
    RecipeEditPage,
  ],
  imports: [
    IonicPageModule.forChild(RecipeEditPage),
    ErrorMessageComponentModule,
    NutritionServiceModule,
    PictureServiceModule,
    RecipeServiceModule
  ],
  exports: [
    RecipeEditPage
  ]
})
export class RecipeEditPageModule {}
