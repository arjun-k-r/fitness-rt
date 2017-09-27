import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ActivityProvider } from './activity';
import { FitnessProviderModule } from '../fitness/fitness.module';

@NgModule({
  imports: [
    IonicPageModule.forChild(ActivityProvider),
    FitnessProviderModule
  ],
  providers: [
    ActivityProvider
  ]
})
export class ActivityProviderModule {}
