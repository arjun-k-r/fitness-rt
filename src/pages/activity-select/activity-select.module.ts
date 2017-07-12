// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { ActivityServiceModule } from '../../providers';

// Pages
import { ActivitySelectPage } from './activity-select';

@NgModule({
  declarations: [
    ActivitySelectPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivitySelectPage),
    ActivityServiceModule
  ],
  exports: [
    ActivitySelectPage
  ]
})
export class ActivitySelectPageModule {}
