// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Models
import { UserProfile } from '../../models';

// Pages
import { SleepPlanPage } from '../sleep-plan/sleep-plan';

// Providers
import { AlertService, FitnessService, NutritionService } from '../../providers';

@Component({
  selector: 'page-fitness',
  templateUrl: 'fitness.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FitnessPage {
  public heartRate: number;
  public idealBodyFat: number;
  public idealWeight: number;
  public profile: UserProfile;
  public profileDetails: string = 'fitness';
  constructor(
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _fitSvc: FitnessService,
    private _navCtrl: NavController,
    private _nutritionSvc: NutritionService,
    private _params: NavParams
  ) {
    if (!!_params.get('new')) {
      this._alertSvc.showAlert('We need to know a little more about your physical constitution', 'Please complete the following form', 'Step 2');
    }

    this.profile = _fitSvc.getProfile();
    console.log('Received profile: ', this.profile);

    if (this.profile.gender) {
      this.idealBodyFat = _fitSvc.getIdealBodyFat(this.profile.gender);
      if (this.profile.height && this.profile.weight) {
        this.idealWeight = _fitSvc.getIdealWeight(this.profile.gender, this.profile.height, this.profile.weight);
      }
    }
  }

  public saveProfile(): void {
    this.profile.heartRate.max = this._fitSvc.getHeartRateMax(this.profile.age);
    let thrRange: { min: number, max: number } = this._fitSvc.getHeartRateTrainingRange(this.profile.heartRate.max, this.profile.heartRate.resting);
    this.profile.heartRate.trainingMin = thrRange.min;
    this.profile.heartRate.trainingMax = thrRange.max;
    this.profile.bmr = this._fitSvc.getBmr(this.profile.age, this.profile.gender, this.profile.height, this.profile.weight);
    this.profile.bodyFat = this._fitSvc.getBodyFat(this.profile.age, this.profile.gender, this.profile.height, this.profile.hips, this.profile.neck, this.profile.waist);
    this.idealBodyFat = this._fitSvc.getIdealBodyFat(this.profile.gender);
    this.idealWeight = this._fitSvc.getIdealWeight(this.profile.gender, this.profile.height, this.profile.weight);
    this.profile.heartRate.max = this._fitSvc.getHeartRateMax(this.profile.age);
    this._fitSvc.restoreEnergyConsumption().then((energyConsumption: number) => {
      this.profile.requirements = this._nutritionSvc.getDri(this.profile.age, energyConsumption === 0 ? this.profile.bmr : energyConsumption, this.profile.gender, this.profile.height, this.profile.lactating, this.profile.pregnant, this.profile.weight);
      this._fitSvc.saveProfile(this.profile);
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
    this._detectorRef.detectChanges();
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
}
