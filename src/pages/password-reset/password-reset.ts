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
  name: 'password-reset'
})
@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html'
})
export class PasswordResetPage {
  private _history: string;
  public email: string;
  public password: AbstractControl;
  public passwordResetForm: FormGroup;
  public resetCode: AbstractControl;
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _fb: FormBuilder,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this._history = _params.get('history');
    this.email = _params.get('email');
    this.passwordResetForm = _fb.group({
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16),
        AuthValidationService.passwordValidation, AuthValidationService.noWhiteSpaceValidation])
      ],
      resetCode: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6),
        AuthValidationService.noWhiteSpaceValidation])
      ]
    });
    this.password = this.passwordResetForm.get('password');
    this.resetCode = this.passwordResetForm.get('resetCode');
  }

  public login(): void {
    this._navCtrl.setRoot('login', {
      history: this._history
    })
  }

  public resetPassword(form: { resetCode: string, password: string }): void {
    let loader = this._loadCtrl.create({
      content: 'Resetting your password...',
      spinner: 'crescent',
      duration: 30000
    });
    loader.present();
    this._afAuth.auth.confirmPasswordReset(form.resetCode, form.password)
      .then(() => {
        loader.dismiss();
        this._navCtrl.popToRoot();
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
