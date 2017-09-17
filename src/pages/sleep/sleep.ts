// Angular
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  AlertController,
  IonicPage,
  NavController,
  Popover,
  PopoverController
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Sleep } from '../../models';

// Providers
import { SleepProvider } from '../../providers';

@IonicPage({
  name: 'sleep',
  segment: 'plan'
})
@Component({
  templateUrl: 'sleep.html'
})
export class SleepPage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _sleepSubscription: Subscription;
  private _sleepFormSubscription: Subscription;
  public bedTime: AbstractControl;
  public duration: AbstractControl;
  public noElectronics: AbstractControl;
  public noStimulants: AbstractControl;
  public refreshing: AbstractControl;
  public relaxation: AbstractControl;
  public sleep: Sleep = new Sleep();
  public sleepForm: FormGroup;
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _formBuilder: FormBuilder,
    private _navCtrl: NavController,
    private _popoverCtrl: PopoverController,
    private _sleepPvd: SleepProvider
  ) {
    this.sleepForm = this._formBuilder.group({
      bedTime: ['', Validators.required],
      duration: ['', Validators.required],
      noElectronics: ['', Validators.required],
      noStimulants: ['', Validators.required],
      refreshing: ['', Validators.required],
      relaxation: ['', Validators.required]
    });
    this.bedTime = this.sleepForm.get('bedTime');
    this.duration = this.sleepForm.get('duration');
    this.noElectronics = this.sleepForm.get('noElectronics');
    this.noStimulants = this.sleepForm.get('noStimulants');
    this.refreshing = this.sleepForm.get('refreshing');
    this.relaxation = this.sleepForm.get('relaxation');
  }

  public saveSleep(): void {
    this._sleepPvd.saveSleep(this._authId, this.sleep)
      .then(() => {
        this._alertCtrl.create({
          title: 'Success!',
          message: 'Sleep saved successfully!',
          buttons: [{
            text: 'Great'
          }]
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
          history: 'sleep'
        });
      };
    })
  }

  ionViewWillEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._authId = auth.uid;
        this._sleepSubscription = this._sleepPvd.getSleep$(this._authId).subscribe(
          (sleep: Sleep) => {
            this.sleep = Object.assign({}, sleep['$value'] === null ? this.sleep : sleep);
            this.sleepForm.controls['bedTime'].patchValue(this.sleep.bedTime);
            this.sleepForm.controls['duration'].patchValue(this.sleep.duration);
            this.sleepForm.controls['noElectronics'].patchValue(this.sleep.combos.noElectronics);
            this.sleepForm.controls['noStimulants'].patchValue(this.sleep.combos.noStimulants);
            this.sleepForm.controls['refreshing'].patchValue(this.sleep.combos.refreshing);
            this.sleepForm.controls['relaxation'].patchValue(this.sleep.combos.relaxation);
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
    this._sleepFormSubscription = this.sleepForm.valueChanges.subscribe(
      (changes: {
        bedTime: string;
        duration: number;
        noElectronics: boolean;
        noStimulants: boolean;
        refreshing: boolean;
        relaxation: boolean;
      }
      ) => {
        if (this.sleepForm.valid) {
          this.sleep = Object.assign(this.sleep, {
            bedTime: changes.bedTime,
            combos: {
              noElectronics: changes.noElectronics,
              noStimulants: changes.noStimulants,
              refreshing: changes.refreshing,
              relaxation: changes.relaxation
            },
            duration: changes.duration
          });
        }
      },
      (err: Error) => console.error(`Error fetching form changes: ${err}`)
    );
  }

  ionViewWillLeave(): void {
    this._authSubscription && this._authSubscription.unsubscribe();
    this._sleepSubscription && this._sleepSubscription.unsubscribe();
    this._sleepFormSubscription && this._sleepFormSubscription.unsubscribe();
  }
}
