// Angular
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  ToastController
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { BodyFat, Fitness, UserProfile } from '../../models';

// Providers
import { UserProfileProvider } from '../../providers';

@IonicPage({
  name: 'profile'
})
@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _loader: Loading;
  public profilePageSegment: string = 'userInfo';
  public userInfo: firebase.UserInfo;
  public userProfile: UserProfile;
  constructor(
    private _afAuth: AngularFireAuth,
    private _navCtrl: NavController,
    private _toastCtrl: ToastController,
    private _userPvd: UserProfileProvider
  ) {
    this.userProfile = new UserProfile(0, new Fitness(0, new BodyFat('', 0, 0, 0), 0), '', 0, false,false, 0);
  }

  public viewPageInfo(): void {
    this._navCtrl.push('profile-info');
  }

  ionViewCanEnter(): void {
    this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!auth) {
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._navCtrl.setRoot('registration', {
          history: 'profile'
        });
      };
    })
  }

  ionViewWillEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._authId = auth.uid;
        const { displayName, email, phoneNumber, photoURL, providerId, uid } = this._afAuth.auth.currentUser;
        this.userInfo = {
          displayName,
          email,
          phoneNumber,
          photoURL,
          providerId,
          uid
        };
        this._userPvd.getUserProfile$(this._authId).subscribe((up: UserProfile) => {
          if (!!up) {
            this.userProfile = Object.assign({}, up);
          }
        }, (err: firebase.FirebaseError) => {
          this._toastCtrl.create({
            closeButtonText: 'GOT IT!',
            cssClass: 'alert-message',
            dismissOnPageChange: true,
            duration: 5000,
            message: `<ion-icon color="warn" name="warning"></ion-icon>${err.message} `,
            showCloseButton: true
          }).present();
        })
      }
    })
  }

}
