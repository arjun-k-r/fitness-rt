import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ActivityService } from './activity.service';

@NgModule({
  declarations: [
    ActivityService,
  ],
  imports: [
    IonicPageModule.forChild(ActivityService),
  ],
  exports: [
    ActivityService
  ]
})
export class ActivityServiceModule {}
