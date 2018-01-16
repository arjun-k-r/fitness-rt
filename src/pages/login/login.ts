// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Ionic
import {
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@IonicPage({
  name: 'login'
})
@Component({
  templateUrl: 'login.html'
})
export class LoginPage {
  private _history: string;
  public email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  public loginForm: FormGroup;
  public password: FormControl = new FormControl('', Validators.required);
  constructor(
    private _afAuth: AngularFireAuth,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _params: NavParams,
    private _toastCtrl: ToastController
  ) {
    this._history = this._params.get('history');
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  public forgotPassword(): void {
    this._navCtrl.setRoot('forgot-password', {
      history: this._history
    })
  }

  public login(): void {
    const loader: Loading = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 5000,
      spinner: 'crescent'
    });
    loader.present();
    this._afAuth.auth.signInWithEmailAndPassword(
      this.loginForm.get('email').value.trim(),
      this.loginForm.get('password').value.trim()
    )
      .then((user: firebase.User) => {
        loader.dismiss();
        if (this._history) {
          this._navCtrl.setRoot(this._history);
        } else {
          this._navCtrl.setRoot('profile');
        }
      }).catch((err: firebase.FirebaseError) => {
        loader.dismiss();
        this._toastCtrl.create({
          closeButtonText: 'GOT IT!',
          cssClass: 'alert-message',
          dismissOnPageChange: true,
          duration: 5000,
          message: `<ion-icon color="warn" name="warning"></ion-icon>${err.message} `,
          showCloseButton: true
        }).present();
      });
  }

  public register(): void {
    this._navCtrl.setRoot('registration', {
      history: this._history
    })
  }
}
