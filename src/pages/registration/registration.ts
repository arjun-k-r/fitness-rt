// App
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Providers
import { AuthValidationService } from '../../providers';

@IonicPage({
  name: 'registration'
})
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html'
})
export class RegistrationPage {
  private _history: string;
  public email: AbstractControl;
  public firstName: AbstractControl;
  public lastName: AbstractControl;
  public password: AbstractControl;
  public passwordConfirm: AbstractControl;
  public registerForm: FormGroup;
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _formBuilder: FormBuilder,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this._history = _params.get('history');
    this.registerForm = this._formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, AuthValidationService.emailValidation,
        AuthValidationService.noWhiteSpaceValidation])
      ],
      firstName: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20), AuthValidationService.noWhiteSpaceValidation])
      ],
      lastName: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20), AuthValidationService.noWhiteSpaceValidation])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16),
        AuthValidationService.passwordValidation, AuthValidationService.noWhiteSpaceValidation])
      ],
      passwordConfirm: ['', Validators.required]
    }, { validator: AuthValidationService.passwordMatchValidation });
    this.email = this.registerForm.get('email');
    this.firstName = this.registerForm.get('firstName');
    this.lastName = this.registerForm.get('lastName');
    this.password = this.registerForm.get('password');
    this.passwordConfirm = this.registerForm.get('passwordConfirm');
  }

  public login(): void {
    this._navCtrl.setRoot('login', {
      history: this._history
    })
  }

  public register(form: { email: string, firstName: string, lastName: string, password: string }): void {
    let loader: Loading = this._loadCtrl.create({
      content: 'Creating your account...',
      spinner: 'crescent',
      duration: 30000
    });
    loader.present();

    this._afAuth.auth.createUserWithEmailAndPassword(form.email.trim(), form.password.trim())
      .then((user: firebase.User) => {
        user.updateProfile({
          displayName: `${form.firstName.trim()} ${form.lastName.trim()}`,
          photoURL: ''
        }).then(() => {
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
    this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._navCtrl.setRoot('fitness');
      }
    })
  }
}
