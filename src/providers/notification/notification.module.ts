import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { NotificationProvider } from './notification';

@NgModule({
  imports: [
    IonicPageModule.forChild(NotificationProvider),
  ],
  providers: [
    NotificationProvider
  ]
})
export class NotificationProviderModule {}
