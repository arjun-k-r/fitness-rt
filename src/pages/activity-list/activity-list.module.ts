import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ActivityListPage } from './activity-list';
import { ActivityFilterPipeModule, LimitPipeModule, SortByPipeModule } from '../../pipes';
import { PhysicalActivityProviderModule } from '../../providers';

@NgModule({
  declarations: [
    ActivityListPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityListPage),
    PhysicalActivityProviderModule,
    ActivityFilterPipeModule,
    LimitPipeModule,
    SortByPipeModule
  ],
})
export class ActivityListPageModule {}
