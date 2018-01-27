import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityListPage } from './activity-list';

@NgModule({
  declarations: [
    ActivityListPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityListPage),
  ],
})
export class ActivityListPageModule {}
