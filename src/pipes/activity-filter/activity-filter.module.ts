import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ActivityFilterPipe } from './activity-filter';

@NgModule({
  declarations: [
    ActivityFilterPipe,
  ],
  imports: [
    IonicPageModule.forChild(ActivityFilterPipe),
  ],
  exports: [
    ActivityFilterPipe
  ]
})
export class ActivityFilterPipeModule {}
