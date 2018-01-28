import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ActivityListPage } from './activity-list';
import { ActivityFilterPipeModule, LimitPipeModule, SortByPipeModule } from '../../pipes';
import { ExerciseProviderModule } from '../../providers';

@NgModule({
  declarations: [
    ActivityListPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityListPage),
    ExerciseProviderModule,
    ActivityFilterPipeModule,
    LimitPipeModule,
    SortByPipeModule
  ],
})
export class ActivityListPageModule {}
