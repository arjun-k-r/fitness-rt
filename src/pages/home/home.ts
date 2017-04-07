// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

// Pages
import { ConstitutionPage } from '../constitution/constitution';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  constructor(
    private _alertCtrl: AlertController,
    private _detectorRef: ChangeDetectorRef,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    if (!!_params.get('new')) {
      let greetAlert = this._alertCtrl.create({
        title: 'First things first!',
        subTitle: 'My sincere congratulations for your decision',
        message: "Before we begin, I would like to know more about you, if you don't mind of course...",
        buttons: ['Yes! Of course']
      });

      greetAlert.present();

      greetAlert.onDidDismiss(() => this._navCtrl.setRoot(ConstitutionPage));
    }
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
