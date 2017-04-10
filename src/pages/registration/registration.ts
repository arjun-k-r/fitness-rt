// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from 'ionic-angular';
import { Auth, IDetailedError, User, UserDetails } from '@ionic/cloud-angular';

// Vendor
import { Md5 } from 'ts-md5/dist/md5';

// Pages
import { GettingStartedPage } from '../getting-started/getting-started';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';

// Providers
import { AlertService, AuthValidator } from '../../providers';

@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationPage {
  public email: AbstractControl;
  public firstName: AbstractControl;
  public lastName: AbstractControl;
  public loginPage: any = LoginPage;
  public password: AbstractControl;
  public passwordConfirm: AbstractControl;
  public registerForm: FormGroup;
  constructor(
    private _alertSvc: AlertService,
    private _auth: Auth,
    private _detectorRef: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _user: User
  ) {
    this.registerForm = this._fb.group({
      email: [
        '',
        Validators.compose([Validators.required, AuthValidator.emailValidator,
        AuthValidator.noWhiteSpace])
      ],
      firstName: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20), AuthValidator.noWhiteSpace])
      ],
      lastName: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20), AuthValidator.noWhiteSpace])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16),
        AuthValidator.passwordValidator, AuthValidator.noWhiteSpace])
      ],
      passwordConfirm: ['', Validators.required]
    }, { validator: AuthValidator.passwordMatchValidator });

    this.email = this.registerForm.get('email');
    this.firstName = this.registerForm.get('firstName');
    this.lastName = this.registerForm.get('lastName');
    this.password = this.registerForm.get('password');
    this.passwordConfirm = this.registerForm.get('passwordConfirm');
  }

  public register(form: { email: string, firstName: string, lastName: string, password: string }): void {
    let loader = this._loadCtrl.create({
      content: 'Creating your account...',
      spinner: 'crescent'
    });

    loader.present();

    let details: UserDetails = {
      'custom': {
        'firstName': form.firstName,
        'lastName': form.lastName
      },
      'email': form.email.trim(),
      'image': 'https://www.gravatar.com/avatar/' + Md5.hashStr(form.email.trim()),
      'name': `${form.firstName.trim()} ${form.lastName.trim()}`,
      'password': form.password.trim(),
      'username': `${form.firstName.trim().toLocaleLowerCase()}${form.lastName.trim().toLocaleLowerCase()}`
    };

    this._auth.signup(details)
      .then(() => {
        this._auth.login('basic', details)
          .then(() => {
            loader.dismiss();
            this._navCtrl.setRoot(GettingStartedPage);
          })
          .catch((err: IDetailedError<Array<string>>) => {
            loader.dismiss();
            for (let e of err.details) {
              this._alertSvc.showAlert(AuthValidator.getErrorMessage(e, err));
            }
          });
      })
      .catch((err: IDetailedError<Array<string>>) => {
        loader.dismiss();
        for (let e of err.details) {
          this._alertSvc.showAlert(AuthValidator.getErrorMessage(e, err));
        }
      });
  }

  ionViewWillEnter(): void {
    if (this._auth.isAuthenticated()) {
      this._navCtrl.setRoot(ProfilePage);
    }
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
