// App
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Providers
import { AuthValidationService } from '../../providers';

@IonicPage({
  name: 'forgot-password'
})
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
  private _history: string;
  public forgotPasswordForm: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _loadCtrl: LoadingController,
    private _fb: FormBuilder,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this._history = _params.get('history');
    this.forgotPasswordForm = _fb.group({
      email: [
        '',
        Validators.compose([Validators.required, AuthValidationService.emailValidation,
        AuthValidationService.noWhiteSpaceValidation])
      ]
    });
    this.email = this.forgotPasswordForm.get('email');
  }

  public login(): void {
    this._navCtrl.setRoot('login', {
      history: this._history
    })
  }

  public reqestReset(form: { email: string }): void {
    let loader = this._loadCtrl.create({
      content: 'Sending request...',
      spinner: 'crescent',
      duration: 30000
    });
    loader.present();
    this._afAuth.auth.sendPasswordResetEmail(form.email)
      .then(() => {
        loader.dismiss();
        this._navCtrl.push('password-reset', { email: form.email });
      })
      .catch((err: firebase.FirebaseError) => {
        loader.dismiss();
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.message,
          buttons: ['OK']
        }).present();
      });
  }
}