// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'page-activity-plan',
  templateUrl: 'activity-plan.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityPlanPage {
  public activityPlanDetails: string = 'guidelines';
  constructor(private _detectorRef: ChangeDetectorRef) { }

  public segmentChange(): void {
    this._detectorRef.markForCheck();
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
