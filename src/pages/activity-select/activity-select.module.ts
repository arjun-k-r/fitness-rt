// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Pages
import { ActivitySelectPage } from './activity-select';

// Pipes
import { LimitPipeModule, SearchPipeModule } from '../../pipes';

// Providers
import { ActivityServiceModule } from '../../providers';

@NgModule({
  declarations: [
    ActivitySelectPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivitySelectPage),
    ActivityServiceModule,
    LimitPipeModule,
    SearchPipeModule
  ],
  exports: [
    ActivitySelectPage
  ]
})
export class ActivitySelectPageModule {}
