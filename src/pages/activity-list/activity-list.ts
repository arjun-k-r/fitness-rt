// App
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  AlertController,
  IonicPage,
  InfiniteScroll,
  Loading,
  LoadingController,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Activity } from '../../models';

// Providers
import { ActivityProvider } from '../../providers';

@IonicPage({
  name: 'activity-list',
  segment: 'index.html'
})
@Component({
  templateUrl: 'activity-list.html'
})
export class ActivityListPage {
  private _activityLoader: Loading;
  private _activitySubscription: Subscription;
  public activityLimit: number = 50;
  public activities: Activity[];
  public activitySearchQuery: string = '';
  public selectedActivities: Activity[] = [];
  constructor(
    private _alertCtrl: AlertController,
    private _activityPvd: ActivityProvider,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _params: NavParams,
    private _viewCtrl: ViewController
  ) { }

  public clearSearchActivities(evenet: string): void {
    this.activitySearchQuery = '';
  }

  public doneSelecting(): void {
    this._viewCtrl.dismiss(this.selectedActivities);
  }

  public loadMoreActivities(ev: InfiniteScroll) {
    this.activityLimit += 50;
    setTimeout(() => ev.complete(), 1000);
  }

  public selectActivity(activity: Activity, checkBox: HTMLInputElement): void {
    const idx: number = this.selectedActivities.indexOf(activity);
    if (idx === -1) {
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
            handler: () => {
              checkBox.checked = false;
            }
          },
          {
            text: 'Done',
            handler: (data: { duration: number }) => {
              activity.duration = +data.duration;
              this._activityPvd.calculateActivityEnergyConsumption(activity)
                .then((energyConsumption: number) => {
                  activity.energyConsumption = energyConsumption;
                  this.selectedActivities = [...this.selectedActivities, activity];
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
    } else {
      this.selectedActivities = [...this.selectedActivities.slice(0, idx), ...this.selectedActivities.slice(idx + 1)];
    }
  }

  ionViewWillEnter(): void {
    this._activityLoader = this._loadCtrl.create({
      content: 'Loading...',
      duration: 30000,
      spinner: 'crescent'
    });
    this._activityLoader.present();
    this._activitySubscription = this._activityPvd.getActivities$().subscribe((activities: Activity[]) => {
      this.activities = [...activities];
      if (this._activityLoader) {
        this._activityLoader.dismiss();
        this._activityLoader = null;
      }
    }, (err: firebase.FirebaseError) => {
      if (this._activityLoader) {
        this._activityLoader.dismiss();
        this._activityLoader = null;
      }
      this._alertCtrl.create({
        title: 'Uhh ohh...',
        subTitle: 'Something went wrong',
        message: err.message,
        buttons: ['OK']
      }).present();
    });
  }

  ionViewWillLeave(): void {
    this._activitySubscription && this._activitySubscription.unsubscribe();
  }
}