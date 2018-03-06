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

// Models
import { Interval } from '../../models';

@IonicPage({
  name: 'interval-edit'
})
@Component({
  templateUrl: 'interval-edit.html',
})
export class IntervalEditPage {
  private intervalFormSubscription: Subscription;
  public interval: Interval;
  public intervalForm: FormGroup;
  constructor(
    private modalCtrl: ModalController,
    private params: NavParams,
    private viewCtrl: ViewController
  ) {
    this.interval = <Interval>this.params.get('interval');
    this.intervalForm = new FormGroup({
      duration: new FormControl(this.interval.duration, [Validators.required]),
      name: new FormControl(this.interval.name, [Validators.required]),
      reps: new FormControl(this.interval.reps, [Validators.required]),
      sets: new FormControl(this.interval.sets, [Validators.required])
    });
    this.watchFormChanges();
  }

  private watchFormChanges(): void {
    this.intervalFormSubscription = this.intervalForm.valueChanges.subscribe(
      (c: {
        duration: string,
        name: string,
        reps: string,
        sets: string
      }) => {
        if (this.intervalForm.valid) {
          this.interval = Object.assign({}, this.interval, {
            duration: +c.duration,
            name: +c.name,
            reps: +c.reps,
            sets: +c.sets
          });
        }
      },
      (err: Error) => console.error(`Error fetching form changes: ${err}`)
    )
  }

  public cancel(): void {
    this.viewCtrl.dismiss();
  }

  public done(): void {
    this.viewCtrl.dismiss(this.interval);
  }
}
