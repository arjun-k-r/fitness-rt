import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ProfilePage } from './profile';
import { UserProfileProviderModule } from '../../providers';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    UserProfileProviderModule
  ],
})
export class ProfilePageModule {}
