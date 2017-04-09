// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage {
  constructor(
    private _alertCtrl: AlertController,
    private _detectorRef: ChangeDetectorRef,
    private _navCtrl: NavController,
    private _params: NavParams
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
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
