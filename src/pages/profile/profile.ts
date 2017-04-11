// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { User } from '@ionic/cloud-angular';

// Models
import { UserProfile } from '../../models';

// Providers
import { ProfileService } from '../../providers';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage {
  public profile: UserProfile;
  constructor(
    private _alertCtrl: AlertController,
    private _detectorRef: ChangeDetectorRef,
    private _navCtrl: NavController,
    private _params: NavParams,
    private _profileSvc: ProfileService,
    private _user: User
  ) {
    if (!!_params.get('new')) {
      let greetAlert = this._alertCtrl.create({
        title: 'Well done!',
        subTitle: 'Now your ready for the next steps',
        message: 'Please complete the rest of your information here',
        buttons: ['Sure']
      });
      greetAlert.present();
    }
    this.profile = Object.assign({}, this._user.get('profile', new UserProfile()));
  }

  public saveProfile(): void {
    this._profileSvc.saveProfile(this.profile);
  }

  ionViewWillEnter(): void {
    this._detectorRef.markForCheck();
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
