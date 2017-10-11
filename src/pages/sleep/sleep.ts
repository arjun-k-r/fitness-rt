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
  ModalController,
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
import { ILineChartEntry, Sleep, SleepGoals, SleepLog } from '../../models';

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
  private _sleepGoalSubscription: Subscription;
  private _weekLogSubscription: Subscription;
  private _weekLog: SleepLog[] = [];
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
  public sleepGoals: SleepGoals = new SleepGoals();
  public sleepSegment: string = 'goals';
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _formBuilder: FormBuilder,
    private _loadCtrl: LoadingController,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _popoverCtrl: PopoverController,
    private _sleepPvd: SleepProvider
  ) {
    this.sleepForm = this._formBuilder.group({
      bedTime: ['', Validators.required],
      duration: ['', Validators.required],
      noElectronics: ['', Validators.required],
      noStimulants: ['', Validators.required],
      quality: ['', Validators.required],
      relaxation: ['', Validators.required]
    });
    this.bedTime = this.sleepForm.get('bedTime');
    this.duration = this.sleepForm.get('duration');
    this.noElectronics = this.sleepForm.get('noElectronics');
    this.noStimulants = this.sleepForm.get('noStimulants');
    this.quality = this.sleepForm.get('quality');
    this.relaxation = this.sleepForm.get('relaxation');
  }

  public changeChartData(): void {
    switch (this.chartDataSelection) {
      case 'duration':
        this.chartData = [{
          data: [...this._weekLog.map((log: SleepLog) => log.duration)],
          label: 'Sleep duration'
        }];
        break;

      case 'bedTime':
        this.chartData = [{
          data: [...this._weekLog.map((log: SleepLog) => moment.duration(log.bedTime).asMinutes() / 60)],
          label: 'Bed time'
        }];
        break;

      case 'quality':
        this.chartData = [{
          data: [...this._weekLog.map((log: SleepLog) => log.quality)],
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
            duration: 30000,
            spinner: 'crescent'
          });
          this._loader.present();
          this._sleepFormSubscription.unsubscribe();
          this.sleepForm = this._formBuilder.group({
            bedTime: ['', Validators.required],
            duration: ['', Validators.required],
            noElectronics: ['', Validators.required],
            noStimulants: ['', Validators.required],
            quality: ['', Validators.required],
            relaxation: ['', Validators.required]
          });
          this.bedTime = this.sleepForm.get('bedTime');
          this.duration = this.sleepForm.get('duration');
          this.noElectronics = this.sleepForm.get('noElectronics');
          this.noStimulants = this.sleepForm.get('noStimulants');
          this.quality = this.sleepForm.get('quality');
          this.relaxation = this.sleepForm.get('relaxation');
          this._sleepFormSubscription = this.sleepForm.valueChanges.subscribe(
            (changes: {
              bedTime: string;
              duration: number;
              noElectronics: boolean;
              noStimulants: boolean;
              quality: number;
              relaxation: boolean;
            }
            ) => {
              if (this.sleepForm.valid) {
                this.sleep = Object.assign(this.sleep, {
                  bedTime: changes.bedTime,
                  combos: {
                    noElectronics: changes.noElectronics,
                    noStimulants: changes.noStimulants,
                    quality: changes.quality,
                    relaxation: changes.relaxation
                  },
                  duration: changes.duration
                });
              }
            },
            (err: Error) => console.error(`Error fetching form changes: ${err}`)
          );
          const subscription: Subscription = this._sleepPvd.getPrevSleep$(this._authId).subscribe(
            (sleep: Sleep) => {
              this.sleep = Object.assign({}, sleep['$value'] === null ? this.sleep : sleep);
              this.sleepForm.controls['bedTime'].patchValue(this.sleep.bedTime);
              this.sleepForm.controls['duration'].patchValue(this.sleep.duration);
              this.sleepForm.controls['noElectronics'].patchValue(this.sleep.combos.noElectronics);
              this.sleepForm.controls['noStimulants'].patchValue(this.sleep.combos.noStimulants);
              this.sleepForm.controls['quality'].patchValue(this.sleep.combos.quality);
              this.sleepForm.controls['relaxation'].patchValue(this.sleep.combos.relaxation);
              subscription.unsubscribe();
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
        }
      }, {
        text: 'No'
      }]
    }).present();
  }

  public saveSleep(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 30000,
      spinner: 'crescent'
    });
    this._loader.present();

    this.sleep.combos.goalsAchieved = this._sleepPvd.checkGoalAchievements(this.sleepGoals, this.sleep);
    this.sleep.lifePoints = this._sleepPvd.checkLifePoints(this.sleep);
    Promise.all([
      this._sleepPvd.saveSleepGoals(this._authId, this.sleepGoals),
      this._sleepPvd.saveSleep(this._authId, this.sleep, this._weekLog)
    ]).then(() => {
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._alertCtrl.create({
          title: 'Success!',
          message: 'Sleep plan saved successfully!',
          buttons: [{
            text: 'Great!',
            handler: () => {
              const goodSleep: boolean = this._sleepPvd.checkGoodSleep(this.sleep);
              this._modalCtrl.create('rewards', {
                context: 'sleep',
                goalsAchieved: this.sleep.combos.goalsAchieved,
                goodQuality: goodSleep,
                lifepoints: this.sleep.lifePoints
              }).present();
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
          history: 'sleep'
        });
      };
    })
  }

  ionViewWillEnter(): void {
    this._loader = this._loadCtrl.create({
      content: 'Loading...',
      duration: 30000,
      spinner: 'crescent'
    });
    this._loader.present();
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._authId = auth.uid;
        this._sleepGoalSubscription = this._sleepPvd.getSleepGoals$(this._authId).subscribe(
          (goals: SleepGoals) => {
            this.sleepGoals = Object.assign({}, goals['$value'] === null ? this.sleepGoals : goals);
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

        this._sleepSubscription = this._sleepPvd.getSleep$(this._authId).subscribe(
          (sleep: Sleep) => {
            this.sleep = Object.assign({}, sleep['$value'] === null ? this.sleep : sleep);
            this.sleepForm.controls['bedTime'].patchValue(this.sleep.bedTime);
            this.sleepForm.controls['duration'].patchValue(this.sleep.duration);
            this.sleepForm.controls['noElectronics'].patchValue(this.sleep.combos.noElectronics);
            this.sleepForm.controls['noStimulants'].patchValue(this.sleep.combos.noStimulants);
            this.sleepForm.controls['quality'].patchValue(this.sleep.combos.quality);
            this.sleepForm.controls['relaxation'].patchValue(this.sleep.combos.relaxation);
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

        this._weekLogSubscription = this._sleepPvd.getSleepLog$(this._authId).subscribe(
          (weekLog: SleepLog[] = []) => {
            this.chartLabels = [...weekLog.map((log: SleepLog) => log.date)];
            this._weekLog = [...weekLog];
            this.chartData = [{
              data: [...this._weekLog.map((log: SleepLog) => log.duration)],
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
    this._sleepFormSubscription = this.sleepForm.valueChanges.subscribe(
      (changes: {
        bedTime: string;
        duration: number;
        noElectronics: boolean;
        noStimulants: boolean;
        quality: number;
        relaxation: boolean;
      }
      ) => {
        if (this.sleepForm.valid) {
          this.sleep = Object.assign(this.sleep, {
            bedTime: changes.bedTime,
            combos: {
              noElectronics: changes.noElectronics,
              noStimulants: changes.noStimulants,
              quality: changes.quality,
              relaxation: changes.relaxation
            },
            duration: changes.duration
          });
        }
      },
      (err: Error) => console.error(`Error fetching form changes: ${err}`)
    );
  }

  ionViewWillLeave(): void {
    this._authSubscription && this._authSubscription.unsubscribe();
    this._sleepSubscription && this._sleepSubscription.unsubscribe();
    this._sleepGoalSubscription && this._sleepGoalSubscription.unsubscribe();
    this._sleepFormSubscription && this._sleepFormSubscription.unsubscribe();
    this._weekLogSubscription && this._weekLogSubscription.unsubscribe();
    if (this._loader) {
      this._loader.dismiss();
      this._loader = null;
    }
  }
}
