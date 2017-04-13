// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Loading, LoadingController, NavController, NavParams } from 'ionic-angular';

// Firebase
import { FirebaseObjectObservable } from 'angularfire2';

// Models
import { Dosha } from '../../models';

// Providers
import { AyurvedicService } from '../../providers';

@Component({
  selector: 'page-dosha-details',
  templateUrl: 'dosha-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoshaDetailsPage {
  public details: string = 'about';
  public dosha: string;
  public doshaDetails: FirebaseObjectObservable<Dosha>;
  constructor(
    private _ayurvedicSvc: AyurvedicService,
    private _detectorRef: ChangeDetectorRef,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this.dosha = _params.get('dosha');
  }

  ionViewWillEnter(): void {
    let loader: Loading = this._loadCtrl.create({
      content: 'Loading...',
      spinner: 'crescent',
      duration: 500
    });
    loader.present();
    this.doshaDetails = this._ayurvedicSvc.getDoshaDetails(this.dosha);
    this._detectorRef.markForCheck();
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
