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
import { FirebaseError, User } from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { ILineChartColors, ILineChartEntry, Sleep, UserProfile } from '../../models';

// Providers
import { NotificationProvider, SleepProvider, UserProfileProvider } from '../../providers';

const CURRENT_DAY: string = moment().format('YYYY-MM-DD');
@IonicPage({
  name: 'sleep'
})
@Component({
  templateUrl: 'sleep.html'
})
export class SleepPage {
  private authId: string;
  private authSubscription: Subscription;
  private sleepSubscription: Subscription;
  private trends: Sleep[] = [];
  private trendSubscription: Subscription;
  public chartColors: ILineChartColors[] = [];
  public chartData: ILineChartEntry[] = [];
  public chartDataSelection: string = 'duration';
  public chartLabels: string[] = [];
  public chartOpts: any = { responsive: true };
  public idealSleep: string;
  public maxDateSelection: string = CURRENT_DAY;
  public pageSegment: string = 'today';
  public sleep: Sleep;
  public sleepDate: string = CURRENT_DAY;
  public trendDays: number = 7;
  public unsavedChanges: boolean = false;
  constructor(
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private notifyPvd: NotificationProvider,
    private sleepPvd: SleepProvider,
    private userPvd: UserProfileProvider
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

  private getTrends(): void {
    this.trendSubscription = this.sleepPvd.getTrends$(this.authId, +this.trendDays).subscribe(
      (trends: Sleep[] = []) => {
        this.chartLabels = [...trends.map((t: Sleep) => t.date)];
        this.trends = [...trends];
        this.chartData = [{
          data: [...this.trends.map((s: Sleep) => s.duration)],
          label: 'Sleep duration'
        }];
      },
      (err: FirebaseError) => {
        this.notifyPvd.showError(err.message);
      }
    );
  }

  public changeChartData(): void {
    switch (this.chartDataSelection) {
      case 'duration':
        this.chartData = [{
          data: [...this.trends.map((s: Sleep) => s.duration)],
          label: 'Sleep duration'
        }];
        break;

      case 'bedTime':
        this.chartData = [{
          data: [...this.trends.map((s: Sleep) => moment.duration(s.bedTime).asMinutes() / 60)],
          label: 'Bed time'
        }];
        break;

      case 'quality':
        this.chartData = [{
          data: [...this.trends.map((s: Sleep) => s.quality)],
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

  public changeTrendDays(): void {
    this.sleepPvd.changeTrendDays(+this.trendDays || 1);
  }

  public getSleep(): void {
    this.notifyPvd.showLoading();
    if (this.sleepSubscription) {
      this.sleepSubscription.unsubscribe();
    }
    this.sleepSubscription = this.sleepPvd.getSleep$(this.authId, this.sleepDate).subscribe((s: Sleep) => {
      if (!!s && s['$value'] !== null) {
        this.sleep = Object.assign({}, s);
        this.notifyPvd.closeLoading();
      }
      this.sleep.date = this.sleepDate;
    }, (err: FirebaseError) => {
      this.notifyPvd.closeLoading();
      this.notifyPvd.showError(err.message);
    });
  }

  public save(): void {
    this.notifyPvd.showLoading();
    this.sleepPvd.saveSleep(this.authId, this.sleep, this.trends)
      .then(() => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showInfo('Sleep saved successfully!');
      }).catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      })
  }

  public viewPageInfo(): void {
    this.navCtrl.push('sleep-info');
  }

  ionViewCanEnter(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe((auth: User) => {
        if (!auth) {
          reject();
          this.navCtrl.setRoot('registration', {
            history: 'sleep'
          });
        }
        resolve();
      }, (err: FirebaseError) => {
        reject(err);
      })
    });
  }

  ionViewCanLEave(): boolean | Promise<{}> {
    if (!this.unsavedChanges) {
      return true;
    }
    return new Promise((resolve, reject) => {
      if (this.unsavedChanges) {
        this.alertCtrl.create({
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
    this.authSubscription = this.afAuth.authState.subscribe((auth: User) => {
      if (!!auth) {
        this.authId = auth.uid;
        this.getSleep();
        this.getTrends();
        const subscription: Subscription = this.userPvd.getUserProfile$(this.authId).subscribe((u: UserProfile) => {
          this.idealSleep = this.sleepPvd.calculateIdealSleep(u.age);
          subscription.unsubscribe();
        }, (err: FirebaseError) => {
          this.notifyPvd.showError(err.message);
        });
      }
    }, (err: FirebaseError) => {
      this.notifyPvd.showError(err.message);
    })
  }

  ionViewWillLeave(): void {
    this.authSubscription.unsubscribe();
    this.sleepSubscription.unsubscribe();
    this.trendSubscription.unsubscribe();
  }
}
