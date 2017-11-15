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
import { BloodCholesterol, BloodCholesterolLog, ILineChartEntry } from '../../models';

// Providers
import { BloodCholesterolProvider } from '../../providers';

@IonicPage({
  name: 'blood-cholesterol'
})
@Component({
  templateUrl: 'blood-cholesterol.html'
})
export class BloodCholesterolPage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _bloodCholesterolSubscription: Subscription;
  private _loader: Loading;
  private _weekLog: BloodCholesterolLog[] = [];
  private _weekLogSubscription: Subscription;
  public bloodCholesterol: BloodCholesterolLog = new BloodCholesterolLog();
  public bloodCholesterolSegment: string = 'dayLog';
  public chartData: ILineChartEntry[] = [];
  public chartDataSelection: string = 'total';
  public chartLabels: string[] = [];
  public chartOpts: any = { responsive: true };
  public idealBloodCholesterol: BloodCholesterol;
  public unit: string = 'mg/dL';
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _bloodCholesterolPvd: BloodCholesterolProvider,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _popoverCtrl: PopoverController
  ) {
    this.idealBloodCholesterol = this._bloodCholesterolPvd.getIdealBloodCholesterol(this.unit);
  }

  public changeChartData(): void {
    switch (this.chartDataSelection) {
      case 'hdl':
        this.chartData = [{
          data: [...this._weekLog.map((log: BloodCholesterolLog) => log.hdl)],
          label: 'HDL'
        }];
        break;

      case 'ldl':
        this.chartData = [{
          data: [...this._weekLog.map((log: BloodCholesterolLog) => log.ldl)],
          label: 'LDL'
        }];
        break;

      case 'total':
        this.chartData = [{
          data: [...this._weekLog.map((log: BloodCholesterolLog) => log.total)],
          label: 'Total'
        }];
        break;

      case 'triglycerides':
        this.chartData = [{
          data: [...this._weekLog.map((log: BloodCholesterolLog) => log.triglycerides)],
          label: 'Triglycerides'
        }];
        break;

      default:
        break;
    }
  }

  public changeUnit(): void {
    this.idealBloodCholesterol = this._bloodCholesterolPvd.getIdealBloodCholesterol(this.unit);
  }

  public saveBloodCholesterol(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();

    this._bloodCholesterolPvd.saveBloodCholesterol(this._authId, this.bloodCholesterol, this._weekLog).then(() => {
      if (this._loader) {
        this._loader.dismiss();
        this._loader = null;
      }
      this._alertCtrl.create({
        title: 'Success!',
        message: 'Blood cholesterol saved successfully!',
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
          history: 'blood-cholesterol'
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
        this._bloodCholesterolSubscription = this._bloodCholesterolPvd.getBloodCholesterol$(this._authId).subscribe(
          (bloodCholesterol: BloodCholesterolLog) => {
            if (this._loader) {
              this._loader.dismiss();
              this._loader = null;
            }
            this.bloodCholesterol = Object.assign({}, bloodCholesterol['$value'] === null ? this.bloodCholesterol : bloodCholesterol);
            this._weekLogSubscription = this._bloodCholesterolPvd.getBloodCholesterolLog$(this._authId).subscribe(
              (weekLog: BloodCholesterolLog[] = []) => {
                this.chartLabels = [...weekLog.map((log: BloodCholesterolLog) => log.date)];
                this._weekLog = [...weekLog];
                this.chartData = [{
                  data: [...this._weekLog.map((log: BloodCholesterolLog) => log.total)],
                  label: 'Total'
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
    this._bloodCholesterolSubscription && this._bloodCholesterolSubscription.unsubscribe();
    this._weekLogSubscription && this._weekLogSubscription.unsubscribe();
    if (this._loader) {
      this._loader.dismiss();
      this._loader = null;
    }
  }
}
