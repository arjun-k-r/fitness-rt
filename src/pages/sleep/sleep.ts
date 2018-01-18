// Angular
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  AlertController,
  IonicPage,
  NavController
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { ILineChartColors, ILineChartEntry, Sleep } from '../../models';

// Providers
import { NotificationProvider, SleepProvider } from '../../providers';

const CURRENT_DAY: string = moment().format('YYYY-MM-DD');
@IonicPage({
  name: 'sleep'
})
@Component({
  templateUrl: 'sleep.html'
})
export class SleepPage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _sleepSubscription: Subscription;
  private _trends: Sleep[] = [];
  private _trendSubscription: Subscription;
  public chartColors: ILineChartColors[] = [];
  public chartData: ILineChartEntry[] = [];
  public chartDataSelection: string = 'duration';
  public chartLabels: string[] = [];
  public chartOpts: any = { responsive: true };
  public maxDateSelection: string = CURRENT_DAY;
  public sleep: Sleep;
  public sleepDate: string = CURRENT_DAY;
  public sleepPageSegment: string = 'today';
  public trendDays: number = 7;
  public unsavedChanges: boolean = false;
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _navCtrl: NavController,
    private _notifyPvd: NotificationProvider,
    private _sleepPvd: SleepProvider
  ) {
    this.chartColors.push({
      backgroundColor: 'rgb(255, 255, 255)',
      borderColor: '#4dd87b',
      pointBackgroundColor: '#4dd87b',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#4dd87b'
    });
    this.sleep = new Sleep('21:00', CURRENT_DAY, 8, '', 10);
  }

  public changeChartData(): void {
    switch (this.chartDataSelection) {
      case 'duration':
        this.chartData = [{
          data: [...this._trends.map((s: Sleep) => s.duration)],
          label: 'Sleep duration'
        }];
        break;

      case 'bedTime':
        this.chartData = [{
          data: [...this._trends.map((s: Sleep) => moment.duration(s.bedTime).asMinutes() / 60)],
          label: 'Bed time'
        }];
        break;

      case 'quality':
        this.chartData = [{
          data: [...this._trends.map((s: Sleep) => s.quality)],
          label: 'Sleep quality'
        }];
        break;


      default:
        break;
    }
  }

  public changeMade(): void {
    this.unsavedChanges = true;
  }

  public getSleep(): void {
    if (this._sleepSubscription) {
      this._sleepSubscription.unsubscribe();
    }
    this._sleepSubscription = this._sleepPvd.getSleep$(this._authId, this.sleepDate).subscribe((s: Sleep) => {
      if (!!s && s['$value'] !== null) {
        this.sleep = Object.assign({}, s);
      }
    }, (err: firebase.FirebaseError) => {
      this._notifyPvd.showError(err.message);
    });
  }

  public getTrends(): void {
    if (this._trendSubscription) {
      this._trendSubscription.unsubscribe();
    }
    this._trendSubscription = this._sleepPvd.getTrends$(this._authId, +this.trendDays).subscribe(
      (trends: Sleep[] = []) => {
        this.chartLabels = [...trends.map((t: Sleep) => t.date)];
        this._trends = [...trends];
        this.chartData = [{
          data: [...this._trends.map((s: Sleep) => s.duration)],
          label: 'Sleep duration'
        }];
      },
      (err: firebase.FirebaseError) => {
        this._notifyPvd.showError(err.message);
      }
    );
  }

  public save(): void {
    this._notifyPvd.showLoading();
    this._sleepPvd.saveSleep(this._authId, this.sleep, this._trends)
      .then(() => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showInfo('Sleep saved successfully!');
      }).catch((err: firebase.FirebaseError) => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showError(err.message);
      })
  }

  public viewPageInfo(): void {
    this._navCtrl.push('sleep-info');
  }

  ionViewCanEnter(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this._afAuth.authState.subscribe((auth: firebase.User) => {
        if (!auth) {
          reject();
          this._navCtrl.setRoot('registration', {
            history: 'sleep'
          });
        }
        resolve();
      })
    });
  }

  ionViewCanLEave(): boolean | Promise<{}> {
    if (!this.unsavedChanges) {
      return true;
    }
    return new Promise((resolve, reject) => {
      if (this.unsavedChanges) {
        this._alertCtrl.create({
          title: 'Unsaved changes',
          message: 'All your changes will be lost. Are you sure you want to leave?',
          buttons: [
            {
              text: 'No',
              handler: () => {
                reject();
              }
            },
            {
              text: 'Yes',
              handler: () => {
                resolve();
              }
            }
          ]
        });
      }
    });
  }

  ionViewWillEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._authId = auth.uid;
        this.getSleep();
        this.getTrends();
      }
    })
  }

  ionViewWillLeave(): void {
    this._authSubscription.unsubscribe();
    this._sleepSubscription.unsubscribe();
    this._trendSubscription.unsubscribe();
  }
}
