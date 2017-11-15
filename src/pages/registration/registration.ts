// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

// Ionic
import {
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  NavParams
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@IonicPage({
  name: 'registration'
})
@Component({
  templateUrl: 'registration.html'
})
export class RegistrationPage {
  private _history: string;
  private _loader: Loading;
  private _tabBarElement: any;
  public email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  public name: FormControl = new FormControl('', [Validators.required, Validators.pattern(/[A-Za-z]+(\s[A-Za-z]+)?$/)]);
  public password: FormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  public passwordConfirm: FormControl = new FormControl('', [Validators.required, CustomValidators.equalTo(this.password)]);
  public registrationForm: FormGroup;
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this._tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this._history = this._params.get('history');
    this.registrationForm = new FormGroup({
      email: this.email,
      name: this.name,
      password: this.password,
      passwordConfirm: this.passwordConfirm
    });
  }

  public login(): void {
    this._navCtrl.setRoot('login', {
      history: this._history
    })
  }

  public register(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();
    this._afAuth.auth.createUserWithEmailAndPassword(this.registrationForm.get('email').value.trim(), this.registrationForm.get('password').value.trim())
      .then((user: firebase.User) => {
        user.updateProfile({
          displayName: this.registrationForm.get('name').value.trim(),
          photoURL: ''
        }).then(() => {
          if (this._loader) {
            this._loader.dismiss();
            this._loader = null;
          }
          if (!!this._history) {
            this._navCtrl.setRoot(this._history);
          } else {
            this._navCtrl.setRoot('fitness');
          }
        }).catch((err: firebase.FirebaseError) => {
          if (this._loader) {
            this._loader.dismiss();
            this._loader = null;
          }
          this._alertCtrl.create({
            title: 'Uhh ohh...',
            subTitle: 'Something went wrong',
            message: err.message,
            buttons: ['OK']
          }).present();
        });
      }).catch((err: firebase.FirebaseError) => {
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.message,
          buttons: ['OK']
        }).present();
      });
  }

  ionViewWillEnter(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 15000,
      spinner: 'crescent'
    });
    this._loader.present();
    if (this._tabBarElement) {
      this._tabBarElement.style.display = 'none';
    }
    this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._navCtrl.setRoot('fitness');
      }
    });
  }

  ionViewWillLeave(): void {
    if (this._loader) {
      this._loader.dismiss();
      this._loader = null;
    }
  }
}
