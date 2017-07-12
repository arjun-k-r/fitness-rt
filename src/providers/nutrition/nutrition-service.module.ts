// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { DRIServiceModule } from '../dri/dri-service.module';
import { FitnessServiceModule } from '../fitness/fitness-service.module';
import { NutritionService } from './nutrition.service';


@NgModule({
  imports: [
    IonicPageModule.forChild(NutritionService),
    DRIServiceModule,
    FitnessServiceModule
  ],
  providers: [
    NutritionService
  ]
})
export class NutritionServiceModule {}
