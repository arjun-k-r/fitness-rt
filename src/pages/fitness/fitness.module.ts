// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Components
import { ErrorMessageComponentModule } from '../../components';

// Providers
import { DRIServiceModule, FitnessServiceModule, NutritionServiceModule } from '../../providers';

// Pages
import { FitnessPage } from './fitness';

@NgModule({
  declarations: [
    FitnessPage,
  ],
  imports: [
    IonicPageModule.forChild(FitnessPage),
    DRIServiceModule,
    ErrorMessageComponentModule,
    FitnessServiceModule,
    NutritionServiceModule
  ],
  exports: [
    FitnessPage
  ]
})
export class FitnessPageModule {}
