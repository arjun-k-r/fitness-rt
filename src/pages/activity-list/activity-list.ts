// App
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  AlertController,
  IonicPage,
  InfiniteScroll,
  ViewController
} from 'ionic-angular';

// Firebase
import { FirebaseError } from 'firebase/app';

// Models
import { Activity, ActivityCategory } from '../../models';

// Providers
import { ExerciseProvider, NotificationProvider } from '../../providers';

@IonicPage({
  name: 'activity-list'
})
@Component({
  templateUrl: 'activity-list.html'
})
export class ActivityListPage {
  private activitySubscription: Subscription;
  public activityLimit: number = 50;
  public activityCategories: ActivityCategory[];
  public activitySearchQuery: string = '';
  public selectedActivities: Activity[] = [];
  constructor(
    private alertCtrl: AlertController,
    private exercisePvd: ExerciseProvider,
    private notifyPvd: NotificationProvider,
    private viewCtrl: ViewController
  ) { }

  public clearSearchActivities(evenet: string): void {
    this.activitySearchQuery = '';
  }

  public done(): void {
    this.viewCtrl.dismiss(this.selectedActivities);
  }

  public loadMoreActivities(ev: InfiniteScroll) {
    this.activityLimit += 50;
    setTimeout(() => ev.complete(), 1000);
  }

  public selectActivity(activity: Activity, activityCategory: ActivityCategory, checkBox: HTMLInputElement): void {
    const idx: number = this.selectedActivities.findIndex((a: Activity) => a.name === activity.name);
    if (idx === -1 || !!checkBox.checked) {
      this.alertCtrl.create({
        title: 'Duration',
        subTitle: `How much ${activityCategory.name}, ${activity.name} did you perform?`,
        inputs: [
          {
            name: 'duration',
            placeholder: `${activity.duration ? activity.duration.toString() : '0'} mins`,
            type: 'number'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              if (idx === -1) {
                checkBox.checked = false;
              }
            }
          },
          {
            text: 'Done',
            handler: (data: { duration: number }) => {
              activity.duration = +data.duration;
              activity.category = activityCategory.name;
              if (idx === -1) {
                this.selectedActivities = [...this.selectedActivities, activity];
              } else {
                this.selectedActivities = [...this.selectedActivities.slice(0, idx), activity, ...this.selectedActivities.slice(idx + 1)];
              }
            }
          }
        ]
      }).present();
    } else {
      this.selectedActivities = [...this.selectedActivities.slice(0, idx), ...this.selectedActivities.slice(idx + 1)];
    }
  }

  ionViewWillEnter(): void {
    this.notifyPvd.showLoading();
    this.activitySubscription = this.exercisePvd.getActivities$().subscribe((ac: ActivityCategory[]) => {
      this.activityCategories = [...ac];
      this.notifyPvd.closeLoading();
    }, (err: FirebaseError) => {
      this.notifyPvd.closeLoading();
      this.notifyPvd.showError(err.message);
    });
  }

  ionViewWillLeave(): void {
    this.activitySubscription.unsubscribe();
  }
}