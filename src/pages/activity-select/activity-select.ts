// App
import { Component } from '@angular/core';
import { AlertController, InfiniteScroll, IonicPage, Loading, LoadingController, NavController, ViewController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Activity } from '../../models';

// Providers
import { ActivityService } from '../../providers';

@IonicPage({
  name: 'activity-select'
})
@Component({
  selector: 'page-activity-select',
  templateUrl: 'activity-select.html'
})
export class ActivitySelectPage {
  private _activitySubscription: Subscription;
  public activities: Array<Activity> = [];
  public limit: number = 50;
  public searchQuery: string = '';
  public selectedActivities: Array<Activity> = [];
  constructor(
    private _activitySvc: ActivityService,
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _viewCtrl: ViewController
  ) { }

  public cancelSelecting(): void {
    this._viewCtrl.dismiss([]);
  }

  public clearSearch(ev): void {
    this.searchQuery = '';
  }

  public doneSelecting(): void {
    this._viewCtrl.dismiss(this.selectedActivities);
  }

  public loadMore(ev: InfiniteScroll) {
    this.limit += 50;
    setTimeout(() => {
      ev.complete();
    }, 1000);
  }

  public selectActivity(activity: Activity, checkBox: HTMLInputElement): void {
    let idx: number = this.selectedActivities.indexOf(activity);
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
              this._activitySvc.calculateEnergyBurn(activity)
                .then((energyBurn: number) => {
                  activity.energyBurn = energyBurn;
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

  ionViewCanEnter(): void {
    this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!auth) {
        this._navCtrl.setRoot('registration', {
          history: 'activity-select'
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
    this._activitySubscription = this._activitySvc.getActivities$().subscribe((activities: Array<Activity>) => {
      this.activities = [...activities];
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
    this._activitySubscription.unsubscribe();
  }
}
