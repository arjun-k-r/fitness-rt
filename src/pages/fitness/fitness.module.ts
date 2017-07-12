// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { FitnessServiceModule, NutritionServiceModule } from '../../providers';

// Pages
import { FitnessPage } from './fitness';

@NgModule({
  declarations: [
    FitnessPage,
  ],
  imports: [
    IonicPageModule.forChild(FitnessPage),
    FitnessServiceModule,
    NutritionServiceModule
  ],
  exports: [
    FitnessPage
  ]
})
export class FitnessPageModule {}
