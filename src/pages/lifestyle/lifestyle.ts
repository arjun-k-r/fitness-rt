// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

// Models
import { UserProfile } from '../../models'

// Providers
import { AlertService, ProfileService } from "../../providers";

@Component({
  selector: 'page-lifestyle',
  templateUrl: 'lifestyle.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LifestylePage {
  public profile: UserProfile;
  public schedule: string = 'sleep';
  constructor(
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _params: NavParams,
    private _profileSvc: ProfileService
  ) {
    this.profile = _profileSvc.getProfile();
    if (!!_params.get('new')) {
      this._alertSvc.showAlert('We need to establish soome lifestyle routines to follow every day', 'Please plan your schedule', 'Step 3');
    }
  }

  /**
   * TODO
   * Get meals by constitution (serving hours, number, recommended interval)
   * Make sleep, eating, and activity plan check methods and warnings
   * (e.g. sleep must be before 10, must workout at least 3 times per week, meal interval and breakfast must suite the constitution)
   * 
   */

  public saveLifestyle(): void {
    this._profileSvc.saveProfile(this.profile);
  }

  public schedulePageChange(): void {
    this._detectorRef.markForCheck();
  }

  ionViewWillEnter(): void {
    this._detectorRef.markForCheck();
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
