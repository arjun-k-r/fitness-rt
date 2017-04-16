// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

// Firebase
import { FirebaseObjectObservable } from 'angularfire2'

// Models
import { Dosha, UserProfile } from '../../models';

// Pages
import { DoshaDetailsPage } from '../dosha-details/dosha-details';

// Providers
import { FitnessService, ProfileService } from '../../providers';

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
    private _alertCtrl: AlertController,
    private _detectorRef: ChangeDetectorRef,
    private _fitSvc: FitnessService,
    private _navCtrl: NavController,
    private _params: NavParams,
    private _profileSvc: ProfileService
  ) {
    if (!!_params.get('new')) {
      let greetAlert = this._alertCtrl.create({
        title: 'Well done!',
        subTitle: 'Now your ready for the next steps',
        message: 'Please complete the rest of your information here',
        buttons: ['Sure']
      });
      greetAlert.present();
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
  }

  ionViewWillEnter(): void {
    this._detectorRef.markForCheck();
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
}
