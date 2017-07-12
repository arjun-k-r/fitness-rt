// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { FitnessService } from './fitness.service';

@NgModule({
  imports: [
    IonicPageModule.forChild(FitnessService),
  ],
  providers: [
    FitnessService
  ]
})
export class FitnessServiceModule {}
