// App
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

// Models
import { Fitness } from '../../models';

// Pages
import { SleepPlanPage } from '../sleep-plan/sleep-plan';

// Providers
import { FitnessService, NutritionService } from '../../providers';

@Component({
  selector: 'page-fitness',
  templateUrl: 'fitness.html'
})
export class FitnessPage {
  public fitness: Fitness = new Fitness();
  public heartRate: number;
  public idealBodyFat: number;
  public idealWeight: number;
  public fitnessDetails: string = 'fitness';
  constructor(
    private _fitSvc: FitnessService,
    private _navCtrl: NavController,
    private _nutritionSvc: NutritionService,
    private _params: NavParams,
    private _toastCtrl: ToastController
  ) {
    if (!!_params.get('new')) {
      this._toastCtrl.create({
        message: 'Please complete the following form',
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'OK'
      }).present();
    }
  }

  public saveFitness(): void {
    let heartRateMax: number = this._fitSvc.getHeartRateMax(this.fitness.age),
    thrRange: { min: number, max: number } = this._fitSvc.getHeartRateTrainingRange(heartRateMax, this.fitness.heartRate.resting);
    this.fitness = Object.assign({}, this.fitness, {
      bmr: this._fitSvc.getBmr(this.fitness.age, this.fitness.gender, this.fitness.height, this.fitness.weight),
      bodyFat: this._fitSvc.getBodyFat(this.fitness.age, this.fitness.gender, this.fitness.height, this.fitness.hips, this.fitness.neck, this.fitness.waist),
      heartRate: {
        max: heartRateMax,
        resting: this.fitness.heartRate.resting,
        trainingMin: thrRange.min,
        trainingMax: thrRange.max
      }
    });

    this.idealBodyFat = this._fitSvc.getIdealBodyFat(this.fitness.gender);
    this.idealWeight = this._fitSvc.getIdealWeight(this.fitness.gender, this.fitness.height, this.fitness.weight);
    this._fitSvc.restoreEnergyConsumption().then((energyConsumption: number) => {
      this.fitness.requirements = Object.assign({}, this._nutritionSvc.getDri(this.fitness.age, (energyConsumption > 0) ? energyConsumption : this.fitness.bmr, this.fitness.gender, this.fitness.height, this.fitness.lactating, this.fitness.pregnant, this.fitness.weight));
      this._fitSvc.saveFitness(this.fitness);
    });

    if (!!this._params.get('new')) {
      this._navCtrl.setRoot(SleepPlanPage, { new: true });
    }
  }

  ionViewWillEnter(): void {
    this.fitness = Object.assign({}, this._fitSvc.getFitness());
    console.log('Received fitness: ', this.fitness);
    this.fitness.requirements = Object.assign({}, this._nutritionSvc.getDri(this.fitness.age, this.fitness.bmr, this.fitness.gender, this.fitness.height, this.fitness.lactating, this.fitness.pregnant, this.fitness.weight));

    if (this.fitness.gender) {
      this.idealBodyFat = this._fitSvc.getIdealBodyFat(this.fitness.gender);
      if (this.fitness.height && this.fitness.weight) {
        this.idealWeight = this._fitSvc.getIdealWeight(this.fitness.gender, this.fitness.height, this.fitness.weight);
      }
    }
  }
}
