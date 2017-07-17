// App
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Fitness, Nutrition } from '../../models';

// Providers
import { FitnessService, NutritionService } from '../../providers';

@IonicPage({
  name: 'fitness'
})
@Component({
  selector: 'page-fitness',
  templateUrl: 'fitness.html'
})
export class FitnessPage {
  public age: AbstractControl;
  public gender: AbstractControl;
  public height: AbstractControl;
  public weight: AbstractControl;
  public fitness: Fitness;
  public fitnessDetails: string = 'fitness';
  public fitnessForm: FormGroup;
  public heartRate: number;
  public isFit: boolean;
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _formBuilder: FormBuilder,
    private _fitSvc: FitnessService,
    private _navCtrl: NavController,
    private _nutritionSvc: NutritionService,
    private _params: NavParams,
    private _toastCtrl: ToastController
  ) { }

  private _saveFitness(): void {
    this.fitness.age = this.fitnessForm.get('age').value;
    this.fitness.gender = this.fitnessForm.get('gender').value;
    this.fitness.height = this.fitnessForm.get('height').value;
    this.fitness.heartRate.resting = this.fitnessForm.get('rhr').value;
    this.fitness.hips = this.fitnessForm.get('hips').value;
    this.fitness.lactating = this.fitnessForm.get('lactating').value;
    this.fitness.neck = this.fitnessForm.get('neck').value;
    this.fitness.pregnant = this.fitnessForm.get('pregnant').value;
    this.fitness.waist = this.fitnessForm.get('waist').value;
    this.fitness.weight = this.fitnessForm.get('weight').value;
    let heartRateMax: number = this._fitSvc.calculateHRMax(this.fitness.age),
      thrRange: { min: number, max: number } = this._fitSvc.calculateTHR(heartRateMax, this.fitness.heartRate.resting);
    this.fitness = Object.assign({}, this.fitness, {
      bmr: this._fitSvc.calculateBmr(this.fitness.age, this.fitness.gender, this.fitness.height, this.fitness.weight),
      bodyFat: this._fitSvc.calculateBodyFat(this.fitness.age, this.fitness.gender, this.fitness.height, this.fitness.hips, this.fitness.neck, this.fitness.waist),
      heartRate: {
        max: heartRateMax,
        resting: this.fitness.heartRate.resting,
        trainingMin: thrRange.min,
        trainingMax: thrRange.max
      }
    });

    this._nutritionSvc.getDri(this.fitness.age, this.fitness.bmr, this.fitness.gender, this.fitness.lactating, this.fitness.pregnant, this.fitness.weight)
      .then((requirements: Nutrition) => {
        this.fitness.requirements = Object.assign({}, requirements);
        this._fitSvc.saveFitness(this.fitness);
      })
      .catch((err: Error) => {
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.message,
          buttons: ['OK']
        }).present();
      });
    this.isFit = this._fitSvc.getBodyFatFlag(this.fitness.bodyFat, this.fitness.gender);
  }

  ionViewCanEnter(): void {
    this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!auth) {
        this._navCtrl.setRoot('registration', {
          history: 'fitness'
        });
      }
    })
  }

  ionViewWillEnter(): void {
    this._fitSvc.getFitness$().subscribe((fitness: Fitness) => {
      this.fitness = Object.assign({}, fitness);
      this.fitnessForm = this._formBuilder.group({
        age: [this.fitness.age, Validators.required],
        gender: [this.fitness.gender, Validators.required],
        height: [this.fitness.height, Validators.required],
        hips: [this.fitness.hips],
        lactating: [this.fitness.lactating],
        neck: [this.fitness.neck],
        pregnant: [this.fitness.pregnant],
        rhr: [this.fitness.heartRate.resting],
        waist: [this.fitness.waist],
        weight: [this.fitness.weight, Validators.required]
      });
      this.age = this.fitnessForm.get('age');
      this.gender = this.fitnessForm.get('gender');
      this.height = this.fitnessForm.get('height');
      this.weight = this.fitnessForm.get('weight');
      this._nutritionSvc.getDri(this.fitness.age, this.fitness.bmr, this.fitness.gender, this.fitness.lactating, this.fitness.pregnant, this.fitness.weight)
        .then((requirements: Nutrition) => {
          this.fitness.requirements = Object.assign({}, requirements);
          this._fitSvc.saveFitness(this.fitness);
        })
        .catch((err: Error) => {
          this._alertCtrl.create({
            title: 'Uhh ohh...',
            subTitle: 'Something went wrong',
            message: err.message,
            buttons: ['OK']
          }).present();
        });
      this.fitnessForm.valueChanges.subscribe(() => this._saveFitness());
      this.isFit = this._fitSvc.getBodyFatFlag(this.fitness.bodyFat, this.fitness.gender);
    }, (err: firebase.FirebaseError) => {
      this._alertCtrl.create({
        title: 'Uhh ohh...',
        subTitle: 'Something went wrong',
        message: err.message,
        buttons: ['OK']
      }).present();
    });
  }
}
