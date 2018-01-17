import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ChartsModule } from 'ng2-charts';

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
    ChartsModule,
    FitnessProviderModule,
    PictureProviderModule
  ],
})
export class ProfilePageModule { }
