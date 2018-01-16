import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ProfilePage } from './profile';
import {
  FitnessProviderModule,
  PictureProviderModule,
  UserProfileProviderModule
} from '../../providers';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    UserProfileProviderModule,
    FitnessProviderModule,
    PictureProviderModule
  ],
})
export class ProfilePageModule { }
