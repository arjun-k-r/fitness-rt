// Angular
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  AlertController,
  IonicPage,
  Platform,
  ViewController
} from 'ionic-angular';
import { IPedometerData, Pedometer } from '@ionic-native/pedometer';

@IonicPage({
  name: 'pedometer'
})
@Component({
  templateUrl: 'pedometer.html',
})
export class PedometerPage {
  private _recordingSubscription: Subscription;
  public isRecording: boolean = false;
  public recordingData: IPedometerData;
  constructor(
    private _alertCtrl: AlertController,
    private _pedometer: Pedometer,
    private _platform: Platform,
    private _viewCtrl: ViewController
  ) {
    this.recordingData = {
      distance: 0,
      floorsAscended: 0,
      floorsDescended: 0,
      numberOfSteps: 0,
      startDate: 0,
      endDate: 0
    }
  }

  public dismiss(): void {
    this._viewCtrl.dismiss();
  }

  public saveRecording(): void {
    this._viewCtrl.dismiss(this.recordingData);
  }

  public startRecording(): void {
    this.isRecording = true;
    this._recordingSubscription = this._pedometer.startPedometerUpdates()
      .subscribe((data: IPedometerData) => {
        this.recordingData = Object.assign({}, data);
      }, (err: any) => {
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.toString(),
          buttons: ['OK']
        }).present();
      });
  }

  public stopRecording(): void {
    this.isRecording = false;
    this._pedometer.stopPedometerUpdates().catch((err: any) => {
      this._alertCtrl.create({
        title: 'Uhh ohh...',
        subTitle: 'Something went wrong',
        message: err.toString(),
        buttons: ['OK']
      }).present();
    });
  }

  ionViewWillEnter() {
    if (!this._platform.is('cordova')) {
      this._alertCtrl.create({
        title: 'Pedometer unavailable',
        message: 'This feature is available only on Android, iOS, and Windows Phone',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.dismiss();
          }
        }]
      }).present();
    } else {
      Promise.all([
        this._pedometer.isDistanceAvailable(),
        this._pedometer.isFloorCountingAvailable(),
        this._pedometer.isStepCountingAvailable()
      ]).then((available: boolean[]) => {
        this._alertCtrl.create({
          title: 'Pedometer initialised successfully',
          message: 'All features are available, including, distance, steps counting, and floor ascending/descending',
          buttons: ['Great']
        }).present();
      })
        .catch((err: any) => {
          this._alertCtrl.create({
            title: 'Uhh ohh...',
            subTitle: 'Something went wrong',
            message: err.toString(),
            buttons: ['OK']
          }).present();
        });
    }
  }

  ionViewWillLeave() {
    this._recordingSubscription && this._recordingSubscription.unsubscribe();
  }

}
