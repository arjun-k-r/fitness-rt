// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';

// Models
import { SleepHabit, SleepPlan } from '../../models';

// Providers
import { SleepService } from '../../providers';

@Component({
  selector: 'page-sleep-plan',
  templateUrl: 'sleep-plan.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SleepPlanPage {
  public sleepPlan: SleepPlan;
  public sleepPlanDetails: string = 'sleep';
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _sleepSvc: SleepService
  ) { }

  public segmentChange(): void {
    this._detectorRef.markForCheck();
  }

  public setBedtime(): void {
    this.sleepPlan.bedTime = this._sleepSvc.getBedtime(this.sleepPlan.wakeUpTime);
    this._detectorRef.detectChanges();
    this._detectorRef.markForCheck();
  }

  public setWakeUptime(): void {
    this.sleepPlan.wakeUpTime = this._sleepSvc.getWakeUptime(this.sleepPlan.bedTime);
    this._detectorRef.detectChanges();
    this._detectorRef.markForCheck();
  }

  ionViewWillEnter(): void {
    this._sleepSvc.getSleepPlan().subscribe((sleepPlan: SleepPlan) => this.sleepPlan = sleepPlan);
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
}
