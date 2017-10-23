import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ActivityListPage } from './activity-list';
import { LimitPipeModule, SearchPipeModule, SortByPipeModule } from '../../pipes';
import { ActivityProviderModule } from '../../providers';

@NgModule({
  declarations: [
    ActivityListPage
  ],
  imports: [
    IonicPageModule.forChild(ActivityListPage),
    ActivityProviderModule,
    LimitPipeModule,
    SearchPipeModule,
    SortByPipeModule
  ],
})
export class ActivityListPageModule {}
