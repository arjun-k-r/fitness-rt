// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

// Models
import { SleepHabit, SleepPlan } from '../../models';

// Providers
import { AlertService, FitnessService, SleepService } from '../../providers';

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
    private _alertCtrl: AlertController,
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _fitSvc: FitnessService,
    private _sleepSvc: SleepService
  ) { }

  public saveSleep(): void {
    this._sleepSvc.saveSleep(this.sleepPlan, this.currentSleep);

    if (!!this.currentSleep.warnings && !!this.currentSleep.warnings.length) {
      console.log(this.currentSleep);
      this._alertSvc.showAlert('Please check the warnings', 'Your sleepng habit seems to be unhealthy', 'Oh oh...');
      this._detectorRef.detectChanges();
    } else {
      this._alertSvc.showAlert('Keep up the good work!', 'A perfectly healthy sleep habit!', 'Well done!');
    }
  }

  public segmentChange(): void {
    this._detectorRef.detectChanges();
  }

  public setBedtime(): void {
    this.currentSleep.bedTime = this._sleepSvc.getBedtime(this.currentSleep.wakeUpTime);
    this._detectorRef.detectChanges();
    this._detectorRef.detectChanges();
  }

  public setWakeUptime(): void {
    this.currentSleep.wakeUpTime = this._sleepSvc.getWakeUptime(this.currentSleep.bedTime);
    this._detectorRef.detectChanges();
    this._detectorRef.detectChanges();
  }

  public viewSymptoms(): void {
    this._fitSvc.getImbalanceSymptoms$('sleep', 'deficiency').subscribe((signs: Array<string>) => {
      this._alertCtrl.create({
        title: 'Sleep deficiency symptoms',
        subTitle: 'Check the symptoms which fit you',
        inputs: [...signs.map((sign: string) => {
          return {
            type: 'checkbox',
            label: sign,
            value: sign
          }
        })],
        buttons: [
          {
            text: 'Done',
            handler: (data: Array<string>) => {
              console.log('My symptoms are: ', data);
              if (data.length > signs.length / 4) {
                this._alertSvc.showAlert('Try to sleep well from now on, okay?', '', 'The time is now to make a change');
              } else {
                this._alertSvc.showAlert('Anyway, make sure to take care of your sleep everyday, okay?', '', 'I am not perfect');
              }
            }
          }
        ]
      }).present();
    });
  }

  ionViewWillEnter(): void {
    this._sleepSvc.getSleepPlan$().subscribe((sleepPlan: SleepPlan) => {
      console.log('Received sleep plan: ', sleepPlan);
      this.sleepPlan = sleepPlan;
      this.currentSleep = this._sleepSvc.getCurrentSleep(this.sleepPlan);
      this._detectorRef.detectChanges();
    });
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
}
