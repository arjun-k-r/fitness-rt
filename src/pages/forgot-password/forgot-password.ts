// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from 'ionic-angular';
import { Auth } from '@ionic/cloud-angular';

// Pages
import { PasswordResetPage } from '../password-reset/password-reset';

// Providers
import { AlertService, AuthValidator } from '../../providers';

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordPage {
  public forgotPasswordForm: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public pswResetPage: any = PasswordResetPage;
  constructor(
    private _alertSvc: AlertService,
    private _auth: Auth,
    private _detectorRef: ChangeDetectorRef,
    private _loadCtrl: LoadingController,
    private _fb: FormBuilder,
    private _navCtrl: NavController
  ) {

    this.forgotPasswordForm = _fb.group({
      email: [
        '',
        Validators.compose([Validators.required, AuthValidator.emailValidator,
        AuthValidator.noWhiteSpace])
      ]
    });

    this.email = this.forgotPasswordForm.get('email');
  }

  public reqestReset(form: { email: string }): void {
    let loader = this._loadCtrl.create({
      content: 'Sending request...',
      spinner: 'crescent'
    });

    loader.present();
    
    this._auth.requestPasswordReset(form.email)
      .then(() => {
        loader.dismiss();
        this._navCtrl.push(PasswordResetPage, { email: form.email });
      })
      .catch((err: Error) => this._alertSvc.showAlert(err.toString()));
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}