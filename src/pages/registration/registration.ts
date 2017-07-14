// App
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Auth, IDetailedError, User, UserDetails } from '@ionic/cloud-angular';

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
    private _alertCtrl: AlertController,
    private _auth: Auth,
    private _formBuilder: FormBuilder,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _params: NavParams,
    private _user: User
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
    let details: UserDetails = {
      'custom': {
        'firstName': form.firstName,
        'lastName': form.lastName
      },
      'email': form.email.trim(),
      'image': '',
      'name': `${form.firstName.trim()} ${form.lastName.trim()}`,
      'password': form.password.trim(),
      'username': `${form.firstName.trim().toLocaleLowerCase()}${form.lastName.trim().toLocaleLowerCase()}`
    };
    this._auth.signup(details)
      .then(() => {
        this._auth.login('basic', details)
          .then(() => {
            loader.dismiss();
            if (this._history) {
              this._navCtrl.setRoot(this._history);
            } else {
              this._navCtrl.setRoot('fitness');
            }
          })
          .catch((err: IDetailedError<Array<string>>) => {
            loader.dismiss();
            for (let e of err.details) {
              this._alertCtrl.create({
                title: 'Uhh ohh...',
                subTitle: 'Something went wrong',
                message: AuthValidationService.getErrorMessage(e, err),
                buttons: ['OK']
              }).present();
            }
          });
      })
      .catch((err: IDetailedError<Array<string>>) => {
        loader.dismiss();
        for (let e of err.details) {
          this._alertCtrl.create({
            title: 'Uhh ohh...',
            subTitle: 'Something went wrong',
            message: AuthValidationService.getErrorMessage(e, err),
            buttons: ['OK']
          }).present();
        }
      });
  }

  ionViewWillEnter(): void {
    if (this._auth.isAuthenticated()) {
      this._navCtrl.setRoot('fitness');
    }
  }
}
