import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';
import { MaterialIconsModule } from 'ionic2-material-icons';

import { ActivityListPage } from './activity-list';
import { ActivityFilterPipeModule, LimitPipeModule, SearchPipeModule, SortByPipeModule } from '../../pipes';
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
    MaterialIconsModule,
    SearchPipeModule,
    SortByPipeModule
  ],
})
export class ActivityListPageModule {}
