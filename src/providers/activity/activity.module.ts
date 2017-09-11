import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ActivityProvider } from './activity';

@NgModule({
  imports: [
    IonicPageModule.forChild(ActivityProvider),
  ],
  providers: [
    ActivityProvider
  ]
})
export class ActivityProviderModule {}
