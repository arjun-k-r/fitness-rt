// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

// Models
import { UserProfile } from '../../models'

// Providers
import { AlertService, ProfileService, SleepService } from "../../providers";

@Component({
  selector: 'page-lifestyle',
  templateUrl: 'lifestyle.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LifestylePage {
  public profile: UserProfile;
  public plan: string = 'sleep';
  constructor(
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _params: NavParams,
    private _profileSvc: ProfileService,
    private _sleepSvc: SleepService
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
  public planPageChange(): void {
    this._detectorRef.markForCheck();
  }

  public saveLifestyle(): void {
    this._profileSvc.saveProfile(this.profile);
  }

  public setBedtime(): void {
    this.profile.sleepPlan.bedTime = this._sleepSvc.getBedtime(this.profile.sleepPlan.wakeUpTime);
    this._detectorRef.detectChanges();
    this._detectorRef.markForCheck();
  }

  public setWakeUptime(): void {
    this.profile.sleepPlan.wakeUpTime = this._sleepSvc.getBedtime(this.profile.sleepPlan.bedTime);
    this._detectorRef.detectChanges();
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
