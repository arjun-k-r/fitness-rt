// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertController, AlertOptions, LoadingController, NavController } from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';

// Pages
import { RegistrationPage } from '../registration/registration';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountPage {

  constructor(
    private _alertCtrl: AlertController,
    private _auth: Auth,
    private _detectorRef: ChangeDetectorRef,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _user: User
  ) { }

  private _deleteAccount(): void {
    let loader = this._loadCtrl.create({
      content: 'Deleting account...',
      spinner: 'crescent'
    });

    loader.present();
    this._user.delete();
    this._user.unstore();
    this._auth.logout();
    loader.dismiss();
    this._navCtrl.setRoot(RegistrationPage);
  }

  public deleteAccountRequest(): void {
    let alertOpt: AlertOptions = {
      title: 'Are you sure you want this?',
      message: 'Your account will be permanently erased and all data will be lost',
      buttons: [
        {
          text: 'Maybe not',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: "Yes, I'm sure",
          handler: () => {
            this._deleteAccount();
          }
        }
      ]
    };

    this._alertCtrl.create(alertOpt).present();
  }

  public signout(): void {
    this._auth.logout();
    this._navCtrl.setRoot(RegistrationPage);
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
