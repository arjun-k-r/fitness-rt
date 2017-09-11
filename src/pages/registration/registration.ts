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
    const loader: Loading = this._loadCtrl.create({
      content: 'Creating your account...',
      spinner: 'crescent',
      duration: 10000
    });
    loader.present();
    this._afAuth.auth.createUserWithEmailAndPassword(this.registrationForm.get('email').value.trim(), this.registrationForm.get('password').value.trim())
      .then((user: firebase.User) => {
        user.updateProfile({
          displayName: this.registrationForm.get('name').value.trim(),
          photoURL: ''
        }).then(() => {
          loader.dismiss();
          if (!!this._history) {
            this._navCtrl.setRoot(this._history);
          } else {
            this._navCtrl.setRoot('tabs');
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

  ionViewWillEnter(): void {
    if (this._tabBarElement) {
      this._tabBarElement.style.display = 'none';
    }
    this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._navCtrl.setRoot('tabs');
      }
    });
  }
}
