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
  name: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private _history: string;
  public email: AbstractControl;
  public loginForm: FormGroup;
  public password: AbstractControl;
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _formBuilder: FormBuilder,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this._history = _params.get('history');
    this.loginForm = _formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, AuthValidationService.emailValidation,
        AuthValidationService.noWhiteSpaceValidation])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16),
        AuthValidationService.passwordValidation, AuthValidationService.noWhiteSpaceValidation])
      ]
    });
    this.email = this.loginForm.get('email');
    this.password = this.loginForm.get('password');
  }

  public forgotPassword(): void {
    this._navCtrl.setRoot('forgot-password', {
      history: this._history
    })
  }

  public login(form: { email: string, password: string }): void {
    let loader = this._loadCtrl.create({
      content: 'Please wait...',
      spinner: 'crescent',
      duration: 30000
    });
    loader.present();
    this._afAuth.auth.signInWithEmailAndPassword(form.email.trim(), form.password.trim())
      .then((user: firebase.User) => {
        loader.dismiss();
        if (this._history) {
          this._navCtrl.setRoot(this._history);
        } else {
          this._navCtrl.setRoot('fitness');
        }
      }).catch((err: firebase.FirebaseError) => {
        loader.dismiss();
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.message,
          buttons: ['OK']
        }).present();
      });
  }

  public register(): void {
    this._navCtrl.setRoot('registration', {
      history: this._history
    })
  }
}
