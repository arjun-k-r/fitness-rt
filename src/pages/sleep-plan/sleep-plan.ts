// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';

// Models
import { SleepHabit, SleepPlan, WarningMessage } from '../../models';

// Providers
import { AlertService, SleepService } from '../../providers';

@Component({
  selector: 'page-sleep-plan',
  templateUrl: 'sleep-plan.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SleepPlanPage {
  public currentSleep: SleepHabit = new SleepHabit();
  public sleepPlan: SleepPlan;
  public sleepPlanDetails: string = 'sleep';
  constructor(
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _sleepSvc: SleepService
  ) { }

  public saveSleep(): void {
    this._sleepSvc.saveSleep(this.sleepPlan, this.currentSleep).then((isGood: boolean) => {
      this._alertSvc.showAlert('Keep up the good work!', 'A perfectly healthy sleep habit!', 'Well done!');
    }).catch((warnings: Array<WarningMessage>) => {
      this.currentSleep.warnings = [...warnings];
      console.log(this.currentSleep);
      this._alertSvc.showAlert('Please check the warnings', 'Your sleepng habit seems to be unhealthy', 'Oh oh...');
      this._detectorRef.markForCheck();
    });;
  }

  public segmentChange(): void {
    this._detectorRef.markForCheck();
  }

  public setBedtime(): void {
    this.currentSleep.bedTime = this._sleepSvc.getBedtime(this.currentSleep.wakeUpTime);
    this._detectorRef.detectChanges();
    this._detectorRef.markForCheck();
  }

  public setWakeUptime(): void {
    this.currentSleep.wakeUpTime = this._sleepSvc.getWakeUptime(this.currentSleep.bedTime);
    this._detectorRef.detectChanges();
    this._detectorRef.markForCheck();
  }

  ionViewWillEnter(): void {
    this._sleepSvc.getSleepPlan$().subscribe((sleepPlan: SleepPlan) => {
      console.log('Received sleep plan: ', sleepPlan);
      this.sleepPlan = sleepPlan;
      this.currentSleep = this._sleepSvc.getCurrentSleep(this.sleepPlan);
      this._detectorRef.markForCheck();
      this._detectorRef.markForCheck();
    });
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
}
