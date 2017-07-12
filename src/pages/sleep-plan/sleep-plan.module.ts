// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Pages
import { SleepPlanPage } from './sleep-plan';

// Providers
import { FitnessServiceModule, SleepServiceModule } from '../../providers';

@NgModule({
  declarations: [
    SleepPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(SleepPlanPage),
    FitnessServiceModule,
    SleepServiceModule
  ],
  exports: [
    SleepPlanPage
  ]
})
export class SleepPlanPageModule {}
