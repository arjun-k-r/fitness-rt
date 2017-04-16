// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';

// Models
import { UserProfile } from '../../models'

// Providers
import { ProfileService } from "../../providers";

@Component({
  selector: 'page-lifestyle',
  templateUrl: 'lifestyle.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LifestylePage {
  public profile: UserProfile;
  public schedule: string = 'sleep';
  constructor(private _detectorRef: ChangeDetectorRef, private _profileSvc: ProfileService) {
    this.profile = _profileSvc.getProfile();
  }

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
