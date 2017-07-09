import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { FitnessService } from './fitness.service';

@NgModule({
  declarations: [
    FitnessService,
  ],
  imports: [
    IonicPageModule.forChild(FitnessService),
  ],
  exports: [
    FitnessService
  ]
})
export class FitnessServiceModule {}
