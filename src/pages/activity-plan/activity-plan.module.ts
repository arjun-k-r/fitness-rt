// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { ActivityServiceModule, FitnessServiceModule } from '../../providers';

// Pages
import { ActivityPlanPage } from './activity-plan';

@NgModule({
  declarations: [
    ActivityPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityPlanPage),
    ActivityServiceModule,
    FitnessServiceModule
  ],
  exports: [
    ActivityPlanPage
  ]
})
export class ActivityPlanPageModule {}
