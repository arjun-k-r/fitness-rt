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
  private history: string;
  public forgotPasswordForm: FormGroup;
  constructor(
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private notifyPvd: NotificationProvider,
    private params: NavParams
  ) {
    this.history = this.params.get('history');
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  public login(): void {
    this.navCtrl.setRoot('login', {
      history: this.history
    })
  }

  public reqestReset(): void {
    this.notifyPvd.showLoading();
    this.afAuth.auth.sendPasswordResetEmail(this.forgotPasswordForm.get('email').value.trim())
      .then(() => {
        this.notifyPvd.closeLoading();
        this.alertCtrl.create({
          title: 'Request sent',
          subTitle: 'An email with a password reset link has been sent',
          message: 'Go to your email inbox, follow the instructions, and change the password of your account.',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.navCtrl.push('login');
            }
          }]
        }).present();
      })
      .catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      });
  }
}
