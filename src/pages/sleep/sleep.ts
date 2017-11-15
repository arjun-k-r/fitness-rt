// Angular
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

// Third-party
import * as moment from 'moment';

// Models
import { ILineChartEntry, Sleep } from '../../models';

// Providers
import { SleepProvider } from '../../providers';

@IonicPage({
  name: 'sleep'
})
@Component({
  templateUrl: 'sleep.html'
})
export class SleepPage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _loader: Loading;
  private _sleepSubscription: Subscription;
  private _sleepFormSubscription: Subscription;
  private _weekLogSubscription: Subscription;
  private _weekLog: Sleep[] = [];
  public bedTime: AbstractControl;
  public chartData: ILineChartEntry[] = [];
  public chartDataSelection: string = 'duration';
  public chartLabels: string[] = [];
  public chartOpts: any = { responsive: true };
  public duration: AbstractControl;
  public noElectronics: AbstractControl;
  public noStimulants: AbstractControl;
  public quality: AbstractControl;
  public relaxation: AbstractControl;
  public sleep: Sleep = new Sleep();
  public sleepForm: FormGroup;
  public sleepSegment: string = 'dayLog';
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _formBuilder: FormBuilder,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _popoverCtrl: PopoverController,
    private _sleepPvd: SleepProvider
  ) {
    this._initSleepForm();
  }

  private _initSleepForm(): void {
    this.sleepForm = this._formBuilder.group({
      bedTime: ['', Validators.required],
      duration: ['', Validators.required]
    });
    this.bedTime = this.sleepForm.get('bedTime');
    this.duration = this.sleepForm.get('duration');
  }

  private _watchSleepChanges(): void {
    this._sleepFormSubscription = this.sleepForm.valueChanges.subscribe(
      (changes: {
        bedTime: string;
        duration: number;
      }
      ) => {
        if (this.sleepForm.valid) {
          this.sleep = Object.assign(this.sleep, {
            bedTime: changes.bedTime,
            duration: changes.duration
          });
        }
      },
      (err: Error) => console.error(`Error fetching form changes: ${err}`)
    );
  }

  public changeChartData(): void {
    switch (this.chartDataSelection) {
      case 'duration':
        this.chartData = [{
          data: [...this._weekLog.map((log: Sleep) => log.duration)],
          label: 'Sleep duration'
        }];
        break;

      case 'bedTime':
        this.chartData = [{
          data: [...this._weekLog.map((log: Sleep) => moment.duration(log.bedTime).asMinutes() / 60)],
          label: 'Bed time'
        }];
        break;

      case 'quality':
        this.chartData = [{
          data: [...this._weekLog.map((log: Sleep) => log.quality)],
          label: 'Sleep quality'
        }];
        break;


      default:
        break;
    }
  }

  public getPrevPlan(): void {
    this._alertCtrl.create({
      title: 'Copy yesterday sleep?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this._loader = this._loadCtrl.create({
            content: 'Please wait...',
            duration: 10000,
            spinner: 'crescent'
          });
          this._loader.present();
          this._sleepFormSubscription.unsubscribe();
          
          this._initSleepForm();

          this._watchSleepChanges();

          const subscription: Subscription = this._sleepPvd.getPrevSleep$(this._authId).subscribe(
            (sleep: Sleep) => {
              if (this._loader) {
                this._loader.dismiss();
                this._loader = null;
              }
              
              this.sleep = Object.assign({}, sleep['$value'] === null ? this.sleep : sleep);
              this.sleepForm.controls['bedTime'].patchValue(this.sleep.bedTime);
              this.sleepForm.controls['duration'].patchValue(this.sleep.duration);
              this.sleepForm.controls['quality'].patchValue(this.sleep.quality);

              subscription.unsubscribe();
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
      }, {
        text: 'No'
      }]
    }).present();
  }

  public saveSleep(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();
    this._sleepPvd.saveSleep(this._authId, this.sleep, this._weekLog).then(() => {
      if (this._loader) {
        this._loader.dismiss();
        this._loader = null;
      }
      this._alertCtrl.create({
        title: 'Success!',
        message: 'Sleep plan saved successfully!',
        buttons: ['Great']
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
          history: 'sleep'
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

        // Subscribe to sleep plan
        this._sleepSubscription = this._sleepPvd.getSleep$(this._authId).subscribe(
          (sleep: Sleep) => {
            this.sleep = Object.assign({}, sleep['$value'] === null ? this.sleep : sleep);
            this.sleepForm.controls['bedTime'].patchValue(this.sleep.bedTime);
            this.sleepForm.controls['duration'].patchValue(this.sleep.duration);
            if (this._loader) {
              this._loader.dismiss();
              this._loader = null;
            }
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

        // Subscribe to last 7 days sleep plans
        this._weekLogSubscription = this._sleepPvd.getSleepLog$(this._authId).subscribe(
          (weekLog: Sleep[] = []) => {
            this.chartLabels = [...weekLog.map((log: Sleep) => `${log.date}`)];
            this._weekLog = [...weekLog];
            this.chartData = [{
              data: [...this._weekLog.map((log: Sleep) => log.duration)],
              label: 'Sleep duration'
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
      }
    });

    // Subscribe to sleep changes
    this._watchSleepChanges();
  }

  ionViewWillLeave(): void {
    this._authSubscription && this._authSubscription.unsubscribe();
    this._sleepSubscription && this._sleepSubscription.unsubscribe();
    this._sleepFormSubscription && this._sleepFormSubscription.unsubscribe();
    this._weekLogSubscription && this._weekLogSubscription.unsubscribe();
    if (this._loader) {
      this._loader.dismiss();
      this._loader = null;
    }
  }
}
