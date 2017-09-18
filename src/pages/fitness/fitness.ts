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
import { Fitness, LifePoints, Nutrition } from '../../models';

// Providers
import { FitnessProvider, NutritionProvider } from '../../providers';

@IonicPage({
  name: 'fitness',
  segment: 'data'
})
@Component({
  templateUrl: 'fitness.html'
})
export class FitnessPage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _fitnessSubscription: Subscription;
  private _fitnessFormSubscription: Subscription;
  public age: AbstractControl;
  public currentLifePoints: number = 0;
  public fitness: Fitness = new Fitness();
  public fitnessForm: FormGroup;
  public fitnessSegment: string = 'fitnessInfo';
  public gender: AbstractControl;
  public heartRate: number;
  public height: AbstractControl;
  public isFit: boolean;
  public lactating: AbstractControl;
  public pregnant: AbstractControl;
  public weight: AbstractControl;
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _fitnessPvd: FitnessProvider,
    private _formBuilder: FormBuilder,
    private _nutritionPvd: NutritionProvider,
    private _navCtrl: NavController,
    private _popoverCtrl: PopoverController
  ) {
    this.fitnessForm = this._formBuilder.group({
      age: ['', Validators.required],
      gender: ['', Validators.required],
      height: ['', Validators.required],
      hips: [0],
      lactating: [false, Validators.required],
      neck: [0],
      pregnant: [false, Validators.required],
      restingHeartRate: [0],
      waist: [0],
      weight: ['', Validators.required]
    });
    this.age = this.fitnessForm.get('age');
    this.gender = this.fitnessForm.get('gender');
    this.height = this.fitnessForm.get('height');
    this.lactating = this.fitnessForm.get('lactating');
    this.pregnant = this.fitnessForm.get('pregnant');
    this.weight = this.fitnessForm.get('weight');
  }

  public saveFitness(): void {
    this._fitnessPvd.saveFitness(this._authId, this.fitness)
      .then(() => {
        this._alertCtrl.create({
          title: 'Success!',
          message: 'Fitness saved successfully!',
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
          history: 'fitness'
        });
      };
    })
  }

  ionViewWillEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._authId = auth.uid;
        this._fitnessSubscription = this._fitnessPvd.getFitness$(this._authId).subscribe(
          (fitness: Fitness) => {
            this.fitness = Object.assign({}, fitness['$value'] === null ? this.fitness : fitness);
            this._nutritionPvd.calculateDRI(this._authId, this.fitness.age, this.fitness.bmr, this.fitness.gender, this.fitness.lactating, this.fitness.pregnant, this.fitness.weight)
              .then((dri: Nutrition) => {
                this.fitness.requirements = Object.assign({}, dri);
                this._fitnessPvd.saveFitness(this._authId, this.fitness)
                .then(() => console.info('Dri updated successfully'))
                .catch((err: Error) => console.error('Error updating dri: ', err));
              })
              .catch((err: Error) => {
                this._alertCtrl.create({
                  title: 'Uhh ohh...',
                  subTitle: 'Something went wrong',
                  message: err.toString(),
                  buttons: ['OK']
                }).present();
              });
            this._fitnessPvd.getLifePoints(this.fitness.lifePoints || new LifePoints())
              .then((lifePoints: LifePoints) => {
                this.fitness.lifePoints = Object.assign({}, lifePoints);
                this._fitnessPvd.saveFitness(this._authId, this.fitness)
                .then(() => console.info('Life points updated successfully'))
                .catch((err: Error) => console.error('Error updating life points: ', err));
                this.currentLifePoints = lifePoints.totalPoints + lifePoints.exercise + lifePoints.nutrition + lifePoints.sleep
              })
              .catch((err: Error) => {
                this._alertCtrl.create({
                  title: 'Uhh ohh...',
                  subTitle: 'Something went wrong',
                  message: err.toString(),
                  buttons: ['OK']
                }).present();
              });
            this.fitnessForm.controls['age'].patchValue(this.fitness.age);
            this.fitnessForm.controls['gender'].patchValue(this.fitness.gender);
            this.fitnessForm.controls['height'].patchValue(this.fitness.height);
            this.fitnessForm.controls['hips'].patchValue(this.fitness.hips);
            this.fitnessForm.controls['lactating'].patchValue(this.fitness.lactating);
            this.fitnessForm.controls['neck'].patchValue(this.fitness.neck);
            this.fitnessForm.controls['pregnant'].patchValue(this.fitness.pregnant);
            this.fitnessForm.controls['restingHeartRate'].patchValue(this.fitness.heartRate && this.fitness.heartRate.resting);
            this.fitnessForm.controls['waist'].patchValue(this.fitness.waist);
            this.fitnessForm.controls['weight'].patchValue(this.fitness.weight);
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
    this._fitnessFormSubscription = this.fitnessForm.valueChanges.subscribe(
      (changes: {
        age: number;
        gender: string;
        height: number;
        hips: number;
        lactating: boolean;
        neck: number;
        pregnant: boolean;
        restingHeartRate: number;
        waist: number;
        weight: number
      }
      ) => {
        if (this.fitnessForm.valid) {
          const hrMax: number = this._fitnessPvd.calculateHRMax(this.fitness.age);
          const thr: { min: number, max: number } = this._fitnessPvd.calculateTHR(hrMax, changes.restingHeartRate);
          this.fitness = Object.assign(this.fitness, {
            age: changes.age,
            bmr: this._fitnessPvd.calculateBmr(changes.age, changes.gender, changes.height, changes.weight),
            bodyFat: this._fitnessPvd.calculateBodyFat(changes.age, changes.gender, changes.height, changes.hips, changes.neck, changes.waist),
            gender: changes.gender,
            heartRate: {
              max: hrMax,
              resting: changes.restingHeartRate || 0,
              trainingMin: thr.min,
              trainingMax: thr.max
            },
            height: changes.height,
            hips: changes.hips || 0,
            lactating: changes.lactating,
            neck: changes.neck || 0,
            pregnant: changes.pregnant,
            waist: changes.waist || 0,
            weight: changes.weight
          });
          this.isFit = this._fitnessPvd.checkFatPercentage(this.fitness.bodyFat, this.fitness.gender);
          this._nutritionPvd.calculateDRI(this._authId, this.fitness.age, this.fitness.bmr, this.fitness.gender, this.fitness.lactating, this.fitness.pregnant, this.fitness.weight)
            .then((dri: Nutrition) => {
              this.fitness.requirements = Object.assign({}, dri);
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
      },
      (err: Error) => console.error(`Error fetching form changes: ${err}`)
    );
  }

  ionViewWillLeave(): void {
    this._authSubscription && this._authSubscription.unsubscribe();
    this._fitnessSubscription && this._fitnessSubscription.unsubscribe();
    this._fitnessFormSubscription && this._fitnessFormSubscription.unsubscribe();
  }
}
