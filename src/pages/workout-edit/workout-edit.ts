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
  NavParams,
  ViewController
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
  private userWeight: number;
  private workoutFormSubscription: Subscription;
  public unsavedChanges: boolean = false;
  public workout: Workout;
  public workoutForm: FormGroup;
  constructor(
    private modalCtrl: ModalController,
    private notifyPvd: NotificationProvider,
    private params: NavParams,
    private physicalActivityPvd: PhysicalActivityProvider,
    private viewCtrl: ViewController
  ) {
    this.authId = this.params.get('authId');
    this.userWeight = <number>this.params.get('userWeight')
    this.workout = <Workout>this.params.get('workout');
    this.workoutForm = new FormGroup({
      energyBurn: new FormControl(this.workout.energyBurn, [Validators.required]),
      name: new FormControl(this.workout.name, [Validators.required])
    });
    this.watchFormChanges();
  }

  private watchFormChanges(): void {
    this.workoutFormSubscription = this.workoutForm.valueChanges.subscribe(
      (c: {
        energyBurn: string,
        name: string
      }) => {
        if (this.workoutForm.valid) {
          this.unsavedChanges = true;
          let key: string;
          if ('$key' in this.workout) {
            key = this.workout['$key'];
          }
          this.workout = Object.assign({}, this.workout, {
            energyBurn: +c.energyBurn,
            name: c.name
          });
          if (key) {
            this.workout['$key'];
          }
        }
      },
      (err: Error) => console.error(`Error fetching form changes: ${err}`)
    )
  }

  public addInterval(): void {
    const newInterval: Interval = new Interval(0, '', 0, 0, 0, 0);
    const modal: Modal = this.modalCtrl.create('interval-edit', { interval: newInterval, id: newInterval.name });
    modal.present();
    modal.onDidDismiss((data: Interval) => {
      if (!!data) {
        this.unsavedChanges = true;
        this.workout.intervals = [...this.workout.intervals, data];
        this.workout.duration = this.physicalActivityPvd.calculateWorkoutDuration(this.workout);
      }
    });
  }

  public cancel(): void {
    this.viewCtrl.dismiss();
  }

  public editInterval(idx: number): void {
    const interval: Interval = this.workout.intervals[idx];
    const modal: Modal = this.modalCtrl.create('interval-edit', { interval, id: interval.name });
    modal.present();
    modal.onDidDismiss((data: Interval) => {
      if (!!data) {
        this.unsavedChanges = true;
        this.workout.intervals = [...this.workout.intervals.slice(0, idx), data, ...this.workout.intervals.slice(idx + 1)];
        this.workout.duration = this.physicalActivityPvd.calculateWorkoutDuration(this.workout);
      }
    });
  }

  public removeInterval(idx: number): void {
    this.workout.intervals = [...this.workout.intervals.slice(0, idx), ...this.workout.intervals.slice(idx + 1)];
  }

  public removeWorkout(): void {
    this.physicalActivityPvd.removeWorkout(this.authId, this.workout)
      .then(() => {
        this.notifyPvd.showInfo('Workout removed successfully');
        this.viewCtrl.dismiss();
      })
      .catch((err: FirebaseError) => {
        this.notifyPvd.showError(err.message);
        this.viewCtrl.dismiss();
      });
  }

  public saveWorkout(): void {
    this.workout.met = this.physicalActivityPvd.calculateWorkoutMet(this.workout, this.userWeight);
    this.physicalActivityPvd.saveWorkout(this.authId, this.workout)
      .then(() => {
        this.notifyPvd.showInfo('Workout saved successfully');
        this.viewCtrl.dismiss();
      })
      .catch((err: FirebaseError) => {
        this.notifyPvd.showError(err.message);
        this.viewCtrl.dismiss();
      });
  }

}
