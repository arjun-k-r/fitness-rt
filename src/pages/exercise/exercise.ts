// Angular
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  Modal,
  ModalController,
  NavController,
  Popover,
  PopoverController
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Activity, ActivityPlan, ExerciseLog, ILineChartEntry } from '../../models';

// Providers
import { ActivityProvider } from '../../providers';

@IonicPage({
  name: 'exercise'
})
@Component({
  templateUrl: 'exercise.html',
})
export class ExercisePage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _activitySubscription: Subscription;
  private _weekLogSubscription: Subscription;
  private _weekLog: ExerciseLog[] = [];
  public activityPlan: ActivityPlan = new ActivityPlan();
  public chartData: ILineChartEntry[] = [];
  public chartDataSelection: string = 'duration';
  public chartLabels: string[] = [];
  public chartOpts: any = { responsive: true };
  public exerciseSegment: string = 'dayLog';
  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _activityPvd: ActivityProvider,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _popoverCtrl: PopoverController
  ) { }

  private _changeDuration(activity: Activity): void {
    this._alertCtrl.create({
      title: 'Duration',
      subTitle: 'How long did you perform this activity?',
      inputs: [
        {
          name: 'duration',
          placeholder: 'Minutes',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Done',
          handler: (data: { duration: string }) => {
            activity.duration = +data.duration;
            this._activityPvd.calculateActivityEnergyConsumption(activity)
              .then((energyConsumption: number) => {
                activity.energyConsumption = energyConsumption;
                this._updateActivityPlan();
              })
              .catch((err: Error) => {
                this._alertCtrl.create({
                  title: 'Uhh ohh...',
                  subTitle: 'Something went wrong',
                  message: err.toString(),
                  buttons: ['OK']
                }).present();
              });
          }
        }
      ]
    }).present();
  }

  private _removeActivity(idx: number): void {
    this.activityPlan.activities = [...this.activityPlan.activities.slice(0, idx), ...this.activityPlan.activities.slice(idx + 1)];
    this._updateActivityPlan();
  }

  private _updateActivityPlan(): void {
    this.activityPlan.totalDuration = this._activityPvd.calculateActivityPlanDuration(this.activityPlan.activities);
    this.activityPlan.totalEnergyConsumption = this._activityPvd.calculateActivityPlanEnergyConsumption(this.activityPlan.activities);
    this.activityPlan.combos.hiit = this._activityPvd.checkHiit(this.activityPlan.activities);
    this.activityPlan.combos.lowActivity = this._activityPvd.checkLowActivity(this.activityPlan.activities);
    this.activityPlan.combos.overtraining = this._activityPvd.checkOvertraining(this.activityPlan.activities);
    this.activityPlan.combos.sedentarism = this._activityPvd.checkSedentarism(this.activityPlan);
  }

  public addActivity(): void {
    const activityListModal: Modal = this._modalCtrl.create('activity-list');
    activityListModal.present();
    activityListModal.onDidDismiss((activities: Activity[]) => {
      if (!!activities) {
        this.activityPlan.activities = this.activityPlan.activities ? [...this.activityPlan.activities, ...activities] : [...activities];
        this._updateActivityPlan();
      }
    });
  }

  public changeActivity(idx: number): void {
    this._actionSheetCtrl.create({
      title: 'Change activity',
      buttons: [
        {
          text: 'Change duration',
          handler: () => {
            this._changeDuration(this.activityPlan.activities[idx]);
          }
        }, {
          text: 'Remove activity',
          handler: () => {
            this._removeActivity(idx);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();
  }

  public changeChartData(): void {
    switch (this.chartDataSelection) {
      case 'duration':
        this.chartData = [{
          data: [...this._weekLog.map((log: ExerciseLog) => log.totalDuration)],
          label: 'Total duration'
        }];
        break;

      case 'energy':
        this.chartData = [{
          data: [...this._weekLog.map((log: ExerciseLog) => log.totalEnergyConsumption)],
          label: 'Total energy consumption'
        }];
        break;


      default:
        break;
    }
  }

  public saveActivityPlan(): void {
    this._updateActivityPlan();
    const lifePoints = this._activityPvd.checkLifePoints(this.activityPlan);
    if (this.activityPlan.lifePoints > lifePoints) {
      this._alertCtrl.create({
        title: 'Watch your exercise routine!',
        message: 'You are losing life points!',
        buttons: [
          {
            text: 'I will',
            handler: () => {
              this.activityPlan.lifePoints = lifePoints;
              this._activityPvd.saveActivityPlan(this._authId, this.activityPlan, this._weekLog)
                .then(() => {
                  this._alertCtrl.create({
                    title: 'Success!',
                    message: 'Activity plan saved successfully!',
                    buttons: ['Great']
                  }).present();
                })
                .catch((err: firebase.FirebaseError) => {
                  this._alertCtrl.create({
                    title: 'Uhh ohh...',
                    subTitle: 'Something went wrong',
                    message: err.message,
                    buttons: ['OK']
                  }).present();
                });
            }
          }
        ]
      }).present();
    } else {
      this._alertCtrl.create({
        title: 'You have improved your activity levels!',
        message: 'You are gaining life points!',
        buttons: [{
          text: 'Great',
          handler: () => {
            this.activityPlan.lifePoints = lifePoints;
            this._activityPvd.saveActivityPlan(this._authId, this.activityPlan, this._weekLog)
              .then(() => {
                this._alertCtrl.create({
                  title: 'Success!',
                  message: 'Activity plan saved successfully!',
                  buttons: ['Great']
                }).present();
              })
              .catch((err: firebase.FirebaseError) => {
                this._alertCtrl.create({
                  title: 'Uhh ohh...',
                  subTitle: 'Something went wrong',
                  message: err.message,
                  buttons: ['OK']
                }).present();
              });
          }
        }]
      }).present();
    }
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
        this._navCtrl.setRoot('registration', {
          history: 'exercise'
        });
      };
    })
  }

  ionViewWillEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._authId = auth.uid;
        this._activitySubscription = this._activityPvd.getActivityPlan$(this._authId).subscribe(
          (activityPlan: ActivityPlan) => {
            this.activityPlan = Object.assign({}, activityPlan['$value'] === null ? this.activityPlan : activityPlan);
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

        this._weekLogSubscription = this._activityPvd.getExerciseLog$(this._authId).subscribe(
          (weekLog: ExerciseLog[] = []) => {
            this._weekLog = [...weekLog];
            this.chartLabels = [...this._weekLog.map((log: ExerciseLog) => log.date)];
            this.chartData = [{
              data: [...this._weekLog.map((log: ExerciseLog) => log.totalDuration)],
              label: 'Total duration'
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
  }

  ionViewWillLeave(): void {
    this._authSubscription && this._authSubscription.unsubscribe();
    this._activitySubscription && this._activitySubscription.unsubscribe();
    this._weekLogSubscription && this._weekLogSubscription.unsubscribe();
  }
}
