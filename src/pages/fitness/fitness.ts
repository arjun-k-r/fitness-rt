// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

// Models
import { Fitness } from '../../models';

// Pages
import { SleepPlanPage } from '../sleep-plan/sleep-plan';

// Providers
import { FitnessService, NutritionService } from '../../providers';

@Component({
  selector: 'page-fitness',
  templateUrl: 'fitness.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FitnessPage {
  public fitness: Fitness = new Fitness();
  public heartRate: number;
  public idealBodyFat: number;
  public idealWeight: number;
  public fitnessDetails: string = 'fitness';
  constructor(
    private _detectorRef: ChangeDetectorRef,
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
        closeButtonText: 'Cancel'
      }).present();
    }
  }

  public saveFitness(): void {
    this.fitness.heartRate.max = this._fitSvc.getHeartRateMax(this.fitness.age);
    let thrRange: { min: number, max: number } = this._fitSvc.getHeartRateTrainingRange(this.fitness.heartRate.max, this.fitness.heartRate.resting);
    this.fitness.heartRate.trainingMin = thrRange.min;
    this.fitness.heartRate.trainingMax = thrRange.max;
    this.fitness.bmr = this._fitSvc.getBmr(this.fitness.age, this.fitness.gender, this.fitness.height, this.fitness.weight);
    this.fitness.bodyFat = this._fitSvc.getBodyFat(this.fitness.age, this.fitness.gender, this.fitness.height, this.fitness.hips, this.fitness.neck, this.fitness.waist);
    this.idealBodyFat = this._fitSvc.getIdealBodyFat(this.fitness.gender);
    this.idealWeight = this._fitSvc.getIdealWeight(this.fitness.gender, this.fitness.height, this.fitness.weight);
    this.fitness.heartRate.max = this._fitSvc.getHeartRateMax(this.fitness.age);
    this._fitSvc.restoreEnergyConsumption().then((energyConsumption: number) => {
      this.fitness.requirements = this._nutritionSvc.getDri(this.fitness.age, energyConsumption === 0 ? this.fitness.bmr : energyConsumption, this.fitness.gender, this.fitness.height, this.fitness.lactating, this.fitness.pregnant, this.fitness.weight);
      this._fitSvc.saveFitness(this.fitness);
      this._detectorRef.detectChanges();
    });

    if (!!this._params.get('new')) {
      this._navCtrl.setRoot(SleepPlanPage, { new: true });
    }
  }

  public segmentChange(): void {
    this._detectorRef.detectChanges();
  }

  ionViewWillEnter(): void {
    this.fitness = Object.assign({}, this._fitSvc.getFitness());
    console.log('Received fitness: ', this.fitness);

    if (this.fitness.gender) {
      this.idealBodyFat = this._fitSvc.getIdealBodyFat(this.fitness.gender);
      if (this.fitness.height && this.fitness.weight) {
        this.idealWeight = this._fitSvc.getIdealWeight(this.fitness.gender, this.fitness.height, this.fitness.weight);
      }
    }

    this._detectorRef.detectChanges();
    this._detectorRef.markForCheck();
  }

  ionViewWillLeave(): void {
    this._detectorRef.detach();
  }
}
