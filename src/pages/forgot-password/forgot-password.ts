// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Ionic
import {
  AlertController,
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseError } from 'firebase/app';

// Providers
import { NotificationProvider } from '../../providers';

@IonicPage({
  name: 'forgot-password'
})
@Component({
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
  private _history: string;
  public forgotPasswordForm: FormGroup;
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _navCtrl: NavController,
    private _notifyPvd: NotificationProvider,
    private _params: NavParams
  ) {
    this._history = this._params.get('history');
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  public login(): void {
    this._navCtrl.setRoot('login', {
      history: this._history
    })
  }

  public reqestReset(): void {
    this._notifyPvd.showLoading();
    this._afAuth.auth.sendPasswordResetEmail(this.forgotPasswordForm.get('email').value.trim())
      .then(() => {
        this._notifyPvd.closeLoading();
        this._alertCtrl.create({
          title: 'Request sent',
          subTitle: 'An email with a password reset link has been sent',
          message: 'Go to your email inbox, follow the instructions, and change the password of your account.',
          buttons: [{
            text: 'OK',
            handler: () => {
              this._navCtrl.push('login');
            }
          }]
        }).present();
      })
      .catch((err: FirebaseError) => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showError(err.message);
      });
  }
}
