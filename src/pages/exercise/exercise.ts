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
import { Activity, ActivityPlan } from '../../models';

// Providers
import { ActivityProvider } from '../../providers';

@IonicPage({
  name: 'exercise',
  segment: 'plan/:id'
})
@Component({
  templateUrl: 'exercise.html',
})
export class ExercisePage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _activitySubscription: Subscription;
  public activityPlan: ActivityPlan = new ActivityPlan();
  public exerciseSegment: string = 'activitys';
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
    this._activityPvd.saveActivityPlan(this._authId, this.activityPlan)
      .then(() => {
        this._alertCtrl.create({
          title: 'Success!',
          message: 'Activity plan saved successfully!',
          buttons: ['Great!']
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

  public addActivity(): void {
    const activityListModal: Modal = this._modalCtrl.create('activity');
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
            this._activityPvd.saveActivityPlan(this._authId, this.activityPlan)
              .then(() => console.info('Activity plan saved successfully'))
              .catch((err: firebase.FirebaseError) => console.error('Error saving activity plan: ', err.message));
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
  }
}
