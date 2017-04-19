// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Third-party
import { FirebaseObjectObservable } from 'angularfire2'

// Models
import { Dosha, UserProfile } from '../../models';

// Pages
import { DoshaDetailsPage } from '../dosha-details/dosha-details';
import { LifestylePage } from '../lifestyle/lifestyle';

// Providers
import { AlertService, FitnessService, ProfileService } from '../../providers';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage {
  public doshaDetails: any = DoshaDetailsPage;
  public idealBodyFat: number;
  public idealWeight: number;
  public profile: UserProfile;
  constructor(
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _fitSvc: FitnessService,
    private _navCtrl: NavController,
    private _params: NavParams,
    private _profileSvc: ProfileService
  ) {
    if (!!_params.get('new')) {
      this._alertSvc.showAlert('We need to know a little more about your physical constitution', 'Please complete the following form', 'Step 2');
    }

    this.profile = _profileSvc.getProfile();

    if (this.profile.gender) {
      this.idealBodyFat = _fitSvc.getIdealBodyFat(this.profile.gender);
      if (this.profile.height && this.profile.weight) {
        this.idealWeight = _fitSvc.getIdealWeight(this.profile.gender, this.profile.height, this.profile.weight);
      }
    }
  }

  public saveProfile(): void {
    this.profile.bmr = this._fitSvc.getBmr(this.profile.age, this.profile.gender, this.profile.height, this.profile.weight);
    this.profile.bodyFat = this._fitSvc.getBodyFat(this.profile.age, this.profile.gender, this.profile.height, this.profile.hips, this.profile.neck, this.profile.waist);
    this.idealBodyFat = this._fitSvc.getIdealBodyFat(this.profile.gender);
    this.idealWeight = this._fitSvc.getIdealWeight(this.profile.gender, this.profile.height, this.profile.weight);
    this._profileSvc.saveProfile(this.profile);
    
    if (!!this._params.get('new')) {
      this._navCtrl.setRoot(LifestylePage, { new: true });
    }
  }

  ionViewWillEnter(): void {
    this._detectorRef.markForCheck();
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
}
