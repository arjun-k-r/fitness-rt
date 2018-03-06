// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  IonicPage,
  Modal,
  ModalController,
  NavController,
  NavParams
} from 'ionic-angular';

// Firebase
import { FirebaseError, User } from 'firebase/app';

// Models
import { Interval, Workout } from '../../models';

// Providers
import { NotificationProvider, PhysicalActivityProvider } from '../../providers';

@IonicPage({
  name: 'workout-edit'
})
@Component({
  templateUrl: 'workout-edit.html',
})
export class WorkoutEditPage {
  private authId: string;
  private workoutFormSubscription: Subscription;
  public unsavedChanges: boolean = false;
  public workout: Workout;
  public workoutForm: FormGroup;
  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private notifyPvd: NotificationProvider,
    private params: NavParams,
    private physicalActivityPvd: PhysicalActivityProvider
  ) {
    this.authId = this.params.get('authId');
    this.workout = <Workout>this.params.get('workout');
    if (!this.workout) {
      this.navCtrl.setRoot('workout-list');
    }
    this.workout = this.workout || new Workout(0, 0, [], '');
    this.workoutForm = new FormGroup({
      duration: new FormControl(this.workout.duration, [Validators.required]),
      energyBurn: new FormControl(this.workout.energyBurn, [Validators.required]),
      name: new FormControl(this.workout.name, [Validators.required])
    });
    this.watchFormChanges();
  }

  private watchFormChanges(): void {
    this.workoutFormSubscription = this.workoutForm.valueChanges.subscribe(
      (c: {
        duration: string,
        energyBurn: string,
        name: string
      }) => {
        if (this.workoutForm.valid) {
          this.unsavedChanges = true;
          this.workout = Object.assign({}, this.workout, {
            '$key': this.workout['$key'],
            duration: +c.duration,
            energyBurn: +c.energyBurn,
            name: c.name
          });
        }
      },
      (err: Error) => console.error(`Error fetching form changes: ${err}`)
    )
  }

  public addInterval(): void {
    const newInterval: Interval = new Interval(0, '', 0, 0);
    const modal: Modal = this.modalCtrl.create('interval-edit', { interval: newInterval, id: newInterval.name }, {
      enableBackdropDismiss: false
    });
    modal.present();
    modal.onWillDismiss((data: Interval) => {
      if (!!data) {
        this.unsavedChanges = true;
        this.workout.intervals.push(data);
      }
    });
  }

  public editInterval(idx: number): void {
    const interval: Interval = this.workout.intervals[idx];
    const modal: Modal = this.modalCtrl.create('interval-edit', { interval, id: interval.name }, {
      enableBackdropDismiss: false
    });
    modal.present();
    modal.onWillDismiss((data: Interval) => {
      if (!!data) {
        this.unsavedChanges = true;
        this.workout.intervals[idx] = Object.assign({}, data);
      }
    });
  }

  public removeInterval(idx: number): void {
    this.workout.intervals.splice(idx, 1);
  }

  public removeWorkout(): void {
    this.physicalActivityPvd.removeWorkout(this.authId, this.workout)
      .then(() => {
        this.notifyPvd.showInfo('Workout removed successfully');
        this.navCtrl.pop();
      })
      .catch((err: FirebaseError) => {
        this.notifyPvd.showError(err.message);
        this.navCtrl.pop();
      });
  }

  public saveWorkout(): void {
    // this.workout.duration = this.physicalActivityPvd.calculateDuration(this.workout);
    this.physicalActivityPvd.saveWorkout(this.authId, this.workout)
      .then(() => {
        this.notifyPvd.showInfo('Workout saved successfully');
        this.navCtrl.pop();
      })
      .catch((err: FirebaseError) => {
        this.notifyPvd.showError(err.message);
        this.navCtrl.pop();
      });
  }

}
