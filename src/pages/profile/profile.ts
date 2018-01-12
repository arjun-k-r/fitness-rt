// Angular
import { Component } from '@angular/core';

// Ionic
import { IonicPage, NavController } from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { User } from '../../models';

// Providers
import { UserProfileProvider } from '../../providers';

@IonicPage({
  name: 'profile'
})
@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public user: User;
  constructor(
    private _navCtrl: NavController,
    private _userPvd: UserProfileProvider
  ) {}

}
