// Angular
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  AlertController,
  IonicPage,
  NavController,
  ViewController
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@IonicPage({
  name: 'settings'
})
@Component({
  templateUrl: 'settings-popover.html',
})
export class SettingsPopoverPage {
  private _auth: firebase.User;
  private _authSubscription: Subscription;
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _navCtrl: NavController,
    private _viewCtrl: ViewController
  ) { }

  public deleteAccount(): void {
    this._alertCtrl.create({
      title: 'Delete account',
      subTitle: 'Are you sure',
      message: 'Warning! This is no way back decision. All your data will be permanently erased',
      buttons: [{
        text: 'Proceed',
        handler: () => {
          this._auth.delete().then(() => {
            this._alertCtrl.create({
              title: 'Success',
              message: 'Your account has been deleted successfully',
              buttons: [{
                text: 'OK',
                handler: () => {
                  this._navCtrl.setRoot('registration');
                }
              }]
            }).present();
          }).catch((err: Error) => this._alertCtrl.create({
            title: 'Uhh ohh...',
            subTitle: 'Something went wrong',
            message: err.toString(),
            buttons: ['OK']
          }).present());
        }
      }, {
        text: 'Cancel'
      }]
    }).present();
  }

  public signOut(): void {
    this._viewCtrl.dismiss();
    this._afAuth.auth.signOut()
      .then(() => this._navCtrl.setRoot('registration'))
      .catch((err: Error) => this._alertCtrl.create({
        title: 'Uhh ohh...',
        subTitle: 'Something went wrong',
        message: err.toString(),
        buttons: ['OK']
      }).present());
  }

  ionViewWillEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => this._auth = auth);
  }

  ionViewWillLeave(): void {
    this._authSubscription && this._authSubscription.unsubscribe();
  }
}
