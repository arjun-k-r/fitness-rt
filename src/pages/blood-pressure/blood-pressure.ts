// Angular
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  Popover,
  PopoverController
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { BloodPressure, BloodPressureLog, ILineChartEntry } from '../../models';

// Providers
import { BloodPressureProvider } from '../../providers';

@IonicPage({
  name: 'blood-pressure'
})
@Component({
  templateUrl: 'blood-pressure.html'
})
export class BloodPressurePage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _bloodPressureSubscription: Subscription;
  private _loader: Loading;
  private _weekLog: BloodPressureLog[] = [];
  private _weekLogSubscription: Subscription;
  public bloodPressure: BloodPressureLog = new BloodPressureLog();
  public bloodPressureSegment: string = 'dayLog';
  public chartData: ILineChartEntry[] = [];
  public chartDataSelection: string = 'total';
  public chartLabels: string[] = [];
  public chartOpts: any = { responsive: true };
  public idealBloodPressure: BloodPressure = new BloodPressure();
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _bloodPressurePvd: BloodPressureProvider,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _popoverCtrl: PopoverController
  ) { }

  public changeChartData(): void {
    switch (this.chartDataSelection) {
      case 'diastolic':
        this.chartData = [{
          data: [...this._weekLog.map((log: BloodPressureLog) => log.diastolic)],
          label: 'Diastolic'
        }];
        break;

      case 'systolic':
        this.chartData = [{
          data: [...this._weekLog.map((log: BloodPressureLog) => log.systolic)],
          label: 'Systolic'
        }];
        break;

      default:
        break;
    }
  }

  public saveBloodPressure(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();

    this._bloodPressurePvd.saveBloodPressure(this._authId, this.bloodPressure, this._weekLog).then(() => {
      if (this._loader) {
        this._loader.dismiss();
        this._loader = null;
      }
      this._alertCtrl.create({
        title: 'Success!',
        message: 'Blood pressure saved successfully!',
        buttons: [{
          text: 'Great!',
          handler: () => {

          }
        }]
      }).present();
    })
      .catch((err: firebase.FirebaseError) => {
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.message,
          buttons: ['OK']
        }).present();
      });
  }

  public showSettings(event: Popover): void {
    const popover: Popover = this._popoverCtrl.create('settings');
    popover.present({
      ev: event
    });
  }

  ionViewCanEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!auth) {
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._navCtrl.setRoot('registration', {
          history: 'blood-pressure'
        });
      };
    })
  }

  ionViewWillEnter(): void {
    this._loader = this._loadCtrl.create({
      content: 'Loading...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._authId = auth.uid;
        this._bloodPressurePvd.getIdealBloodPressure(this._authId)
          .then((idealBloodPressure: BloodPressure) => {
            this.idealBloodPressure = Object.assign({}, idealBloodPressure);
          })
          .catch((err: firebase.FirebaseError) => {
            if (this._loader) {
              this._loader.dismiss();
              this._loader = null;
            }
            this._alertCtrl.create({
              title: 'Uhh ohh...',
              subTitle: 'Something went wrong',
              message: err.message,
              buttons: ['OK']
            }).present();
          }
          );
        this._bloodPressureSubscription = this._bloodPressurePvd.getBloodPressure$(this._authId).subscribe(
          (bloodPressure: BloodPressureLog) => {
            if (this._loader) {
              this._loader.dismiss();
              this._loader = null;
            }
            this.bloodPressure = Object.assign({}, bloodPressure['$value'] === null ? this.bloodPressure : bloodPressure);
            this._weekLogSubscription = this._bloodPressurePvd.getBloodPressureLog$(this._authId).subscribe(
              (weekLog: BloodPressureLog[] = []) => {
                this.chartLabels = [...weekLog.map((log: BloodPressureLog) => log.date)];
                this._weekLog = [...weekLog];
                this.chartData = [{
                  data: [...this._weekLog.map((log: BloodPressureLog) => log.diastolic)],
                  label: 'Diastolic'
                }];
              },
              (err: firebase.FirebaseError) => {
                this._alertCtrl.create({
                  title: 'Uhh ohh...',
                  subTitle: 'Something went wrong',
                  message: err.message,
                  buttons: ['OK']
                }).present();
              }
            );
          },
          (err: firebase.FirebaseError) => {
            if (this._loader) {
              this._loader.dismiss();
              this._loader = null;
            }
            this._alertCtrl.create({
              title: 'Uhh ohh...',
              subTitle: 'Something went wrong',
              message: err.message,
              buttons: ['OK']
            }).present();
          }
        );
      }
    });
  }

  ionViewWillLeave(): void {
    this._authSubscription && this._authSubscription.unsubscribe();
    this._bloodPressureSubscription && this._bloodPressureSubscription.unsubscribe();
    this._weekLogSubscription && this._weekLogSubscription.unsubscribe();
    if (this._loader) {
      this._loader.dismiss();
      this._loader = null;
    }
  }
}
