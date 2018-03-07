// App
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  AlertController,
  IonicPage,
  InfiniteScroll,
  ModalController,
  NavParams,
  ViewController
} from 'ionic-angular';

// Firebase
import { FirebaseError } from 'firebase/app';

// Models
import { Activity, ActivityCategory, Workout } from '../../models';

// Providers
import { PhysicalActivityProvider, NotificationProvider } from '../../providers';

@IonicPage({
  name: 'activity-list'
})
@Component({
  templateUrl: 'activity-list.html'
})
export class ActivityListPage {
  private activitySubscription: Subscription;
  private authId: string;
  private userWeight: number;
  private workoutSubscription: Subscription;
  public activityLimit: number = 50;
  public activityCategories: ActivityCategory[];
  public activityPageSegmet: string = 'activities';
  public activitySearchQuery: string = '';
  public selectedActivities: (Activity | Workout)[] = [];
  public workoutLimit: number = 50;
  public workouts: Workout[];
  public workoutSearchQuery: string = '';
  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private physicalActivityPvd: PhysicalActivityProvider,
    private params: NavParams,
    private notifyPvd: NotificationProvider,
    private viewCtrl: ViewController
  ) {
    this.authId = this.params.get('authId');
    this.userWeight = <number>this.params.get('userWeight')
  }

  public addWorkout(): void {
    const newWorkout: Workout = new Workout(0, 0, [], 0, '');
    this.modalCtrl.create('workout-edit', { authId: this.authId, workout: newWorkout, id: newWorkout.name, userWeight: this.userWeight }).present();
  }

  public clearSearchActivities(evenet: string): void {
    this.activitySearchQuery = '';
  }

  public clearSearchWorkouts(): void {
    this.workoutSearchQuery = '';
  }

  public editWorkout(workout: Workout): void {
    this.modalCtrl.create('workout-edit', { authId: this.authId, workout, id: workout.name, userWeight: this.userWeight }).present();
  }

  public done(): void {
    this.viewCtrl.dismiss(this.selectedActivities);
  }

  public getWorkouts(): void {
    if (!this.workoutSubscription || (this.workoutSubscription && this.workoutSubscription.closed)) {
      this.notifyPvd.showLoading();
      this.workoutSubscription = this.physicalActivityPvd.getWorkouts$(this.authId).subscribe((workouts: Workout[]) => {
        this.workouts = [...workouts];
        this.notifyPvd.closeLoading()
      }, (err: FirebaseError) => {
        this.notifyPvd.closeLoading()
        this.notifyPvd.showError(err.message);
      });
    }
  }

  public loadMoreActivities(ev: InfiniteScroll) {
    this.activityLimit += 50;
    setTimeout(() => ev.complete(), 1000);
  }

  public loadMoreWorkouts(ev: InfiniteScroll) {
    this.workoutLimit += 50;
    setTimeout(() => ev.complete(), 1000);
  }

  public removeWorkout(workout: Workout): void {
    this.physicalActivityPvd.removeWorkout(this.authId, workout)
      .then(() => {
        this.notifyPvd.showInfo('Workout removed successfully');
        this.viewCtrl.dismiss();
      })
      .catch((err: FirebaseError) => {
        this.notifyPvd.showError(err.message);
        this.viewCtrl.dismiss();
      });
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

  public selectWorkout(workout: Workout): void {
    const idx: number = this.selectedActivities.indexOf(workout);
    if (idx !== -1) {
      this.selectedActivities = [...this.selectedActivities.slice(0, idx), ...this.selectedActivities.slice(idx + 1)];
    } else {
      this.selectedActivities = [...this.selectedActivities, workout];
    }
  }

  ionViewWillEnter(): void {
    this.notifyPvd.showLoading();
    this.activitySubscription = this.physicalActivityPvd.getActivities$().subscribe((ac: ActivityCategory[]) => {
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