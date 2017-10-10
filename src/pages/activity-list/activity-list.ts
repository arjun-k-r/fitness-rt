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
  NavParams,
  ViewController
} from 'ionic-angular';

// Firebase
import * as firebase from 'firebase/app';

// Thir-party
import { find } from 'lodash';

// Models
import { ActivityCategory, ActivityType } from '../../models';

// Providers
import { ActivityProvider } from '../../providers';

@IonicPage({
  name: 'activity-list'
})
@Component({
  templateUrl: 'activity-list.html'
})
export class ActivityListPage {
  private _activitySubscription: Subscription;
  private _authId: string;
  private _loader: Loading;
  public activityLimit: number = 50;
  public activitySorting: string = 'name';
  public activityCategories: ActivityCategory[];
  public activitySearchQuery: string = '';
  public selectedActivities: ActivityType[] = [];
  constructor(
    private _alertCtrl: AlertController,
    private _activityPvd: ActivityProvider,
    private _loadCtrl: LoadingController,
    private _params: NavParams,
    private _viewCtrl: ViewController
  ) {
    this._authId = this._params.get('authId');
  }

  public changeActivityOrder(): void {
    this.activitySorting = this.activitySorting === 'name' ? 'met' : 'name';
  }

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

  public selectActivity(selectedActivities: ActivityType[]): void {
    selectedActivities.forEach((selectedActivity: ActivityType) => {
      if (!find(this.selectedActivities, (activity: ActivityType) => activity.name === selectedActivity.name)) {
        this.selectedActivities = [...this.selectedActivities, Object.assign({}, selectedActivity, { duration: 0, energyConsumption: 0 })]
      }
    })
  }

  ionViewWillEnter(): void {
    this._loader = this._loadCtrl.create({
      content: 'Loading...',
      duration: 30000,
      spinner: 'crescent'
    });
    this._loader.present();
    this._activitySubscription = this._activityPvd.getActivityCategories$().subscribe((activities: ActivityCategory[]) => {
      this.activityCategories = [...activities];
      if (this._loader) {
        this._loader.dismiss();
        this._loader = null;
      }
    }, (err: firebase.FirebaseError) => {
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

  ionViewWillLeave(): void {
    this._activitySubscription && this._activitySubscription.unsubscribe();
    if (this._loader) {
      this._loader.dismiss();
      this._loader = null;
    }
  }
}