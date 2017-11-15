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
import { BloodSugar, BloodSugarLog, ILineChartEntry } from '../../models';

// Providers
import { BloodSugarProvider } from '../../providers';

@IonicPage({
  name: 'blood-sugar'
})
@Component({
  templateUrl: 'blood-sugar.html'
})
export class BloodSugarPage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _bloodSugarSubscription: Subscription;
  private _loader: Loading;
  private _weekLog: BloodSugarLog[] = [];
  private _weekLogSubscription: Subscription;
  public bloodSugar: BloodSugarLog = new BloodSugarLog();
  public bloodSugarSegment: string = 'dayLog';
  public chartData: ILineChartEntry[] = [];
  public chartDataSelection: string = 'total';
  public chartLabels: string[] = [];
  public chartOpts: any = { responsive: true };
  public idealBloodSugar: BloodSugar;
  public unit: string = 'mg/dL';
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _bloodSugarPvd: BloodSugarProvider,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _popoverCtrl: PopoverController
  ) {
    this.idealBloodSugar = this._bloodSugarPvd.getIdealBloodSugar(this.unit);
  }

  public changeChartData(): void {
    switch (this.chartDataSelection) {
      case 'bedTime':
        this.chartData = [{
          data: [...this._weekLog.map((log: BloodSugarLog) => log.bedTime)],
          label: 'Bed time'
        }];
        break;

      case 'fasting':
        this.chartData = [{
          data: [...this._weekLog.map((log: BloodSugarLog) => log.fasting)],
          label: 'Fasting'
        }];
        break;

      case 'postMeal':
        this.chartData = [{
          data: [...this._weekLog.map((log: BloodSugarLog) => log.postMeal)],
          label: 'Post meal'
        }];
        break;

      case 'preMeal':
        this.chartData = [{
          data: [...this._weekLog.map((log: BloodSugarLog) => log.preMeal)],
          label: 'Pre meal'
        }];
        break;

      default:
        break;
    }
  }

  public changeUnit(): void {
    this.idealBloodSugar = this._bloodSugarPvd.getIdealBloodSugar(this.unit);
  }

  public saveBloodSugar(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();

    this._bloodSugarPvd.saveBloodSugar(this._authId, this.bloodSugar, this._weekLog).then(() => {
      if (this._loader) {
        this._loader.dismiss();
        this._loader = null;
      }
      this._alertCtrl.create({
        title: 'Success!',
        message: 'Blood sugar saved successfully!',
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
          history: 'blood-sugar'
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
        this._bloodSugarSubscription = this._bloodSugarPvd.getBloodSugar$(this._authId).subscribe(
          (bloodSugar: BloodSugarLog) => {
            if (this._loader) {
              this._loader.dismiss();
              this._loader = null;
            }
            this.bloodSugar = Object.assign({}, bloodSugar['$value'] === null ? this.bloodSugar : bloodSugar);
            this._weekLogSubscription = this._bloodSugarPvd.getBloodSugarLog$(this._authId).subscribe(
              (weekLog: BloodSugarLog[] = []) => {
                this.chartLabels = [...weekLog.map((log: BloodSugarLog) => log.date)];
                this._weekLog = [...weekLog];
                this.chartData = [{
                  data: [...this._weekLog.map((log: BloodSugarLog) => log.fasting)],
                  label: 'Fasting'
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
    this._bloodSugarSubscription && this._bloodSugarSubscription.unsubscribe();
    this._weekLogSubscription && this._weekLogSubscription.unsubscribe();
    if (this._loader) {
      this._loader.dismiss();
      this._loader = null;
    }
  }
}
