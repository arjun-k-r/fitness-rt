import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { UserProfileProvider } from './user-profile';

@NgModule({
  imports: [
    IonicPageModule.forChild(UserProfileProvider),
  ],
  providers: [
    UserProfileProvider
  ]
})
export class UserProfileProviderModule {}
