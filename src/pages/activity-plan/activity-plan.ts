// App
import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, Loading, LoadingController, Modal, ModalController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Activity, ActivityPlan } from '../../models';

// Providers
import { ActivityService, FitnessService } from '../../providers';

@IonicPage({
  name: 'activity-plan'
})
@Component({
  selector: 'page-activity-plan',
  templateUrl: 'activity-plan.html'
})
export class ActivityPlanPage {
  private _activityPlanSubscription: Subscription;
  public activityPlan: ActivityPlan = new ActivityPlan();
  public activityPlanDetails: string = 'guidelines';
  public leftEnergy: number = 0;
  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _activitySvc: ActivityService,
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _fitSvc: FitnessService,
    private _loadCtrl: LoadingController,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController
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
          handler: data => {
            activity.duration = +data.duration;
            this._activitySvc.calculateEnergyBurn(activity)
              .then((energyBurn: number) => {
                activity.energyBurn = energyBurn;
                this._activitySvc.checkActivity(activity, this.activityPlan);
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
    this.activityPlan.totalDuration = this._activitySvc.calculateDurationTotal(this.activityPlan.activities);
    this.activityPlan.totalEnergyBurn = this._activitySvc.calculateEnergyBurnTotal(this.activityPlan.activities);
    this._activitySvc.checkActivityPlan(this.activityPlan);
    this._activitySvc.saveActivityPlan(this.activityPlan)
      .then((leftEnergy: number) => this.leftEnergy = leftEnergy)
      .catch((err: Error) => {
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.toString(),
          buttons: ['OK']
        }).present();
      });
  }

  public addNewActivity(): void {
    let activitySelectModal: Modal = this._modalCtrl.create('activity-select');
    activitySelectModal.present();
    activitySelectModal.onDidDismiss((activities: Array<Activity>) => {
      if (!!activities.length) {
        this.activityPlan.activities = [...this.activityPlan.activities, ...activities];
        this.activityPlan.activities.forEach((activity: Activity) => this._activitySvc.checkActivity(activity, this.activityPlan));
        this._updateActivityPlan();
      }
    });
  }

  public changeActivity(idx: number): void {
    this._actionSheetCtrl.create({
      title: 'Change item',
      buttons: [
        {
          text: 'Change duration',
          handler: () => {
            this._changeDuration(this.activityPlan.activities[idx]);
          }
        }, {
          text: 'Remove item',
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

  ionViewCanEnter(): void {
    this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!auth) {
        this._navCtrl.setRoot('registration', {
          history: 'activity-plan'
        });
      }
    })
  }

  ionViewWillEnter(): void {
    let loader: Loading = this._loadCtrl.create({
      content: 'Loading...',
      spinner: 'crescent',
      duration: 30000
    });
    loader.present();
    this._activitySvc.getLeftEnergy().then((energy: number) => this.leftEnergy = energy)
      .catch((error: Error) => {
        loader.dismiss();
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: error.toString(),
          buttons: ['OK']
        }).present();
      });
    this._activityPlanSubscription = this._activitySvc.getActivityPlan$().subscribe((activityPlan: ActivityPlan) => {
      this.activityPlan = Object.assign({}, activityPlan);
      loader.dismiss();
    }, (error: Error) => {
      loader.dismiss();
      this._alertCtrl.create({
        title: 'Uhh ohh...',
        subTitle: 'Something went wrong',
        message: error.toString(),
        buttons: ['OK']
      }).present();
    });
  }

  ionViewWillLeave(): void {
    this._activityPlanSubscription.unsubscribe();
  }
}
