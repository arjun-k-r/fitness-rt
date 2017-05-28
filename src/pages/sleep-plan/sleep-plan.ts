// App
import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

// Models
import { SleepHabit, SleepPlan } from '../../models';

// Providers
import { FitnessService, SleepService } from '../../providers';

@Component({
  selector: 'page-sleep-plan',
  templateUrl: 'sleep-plan.html'
})
export class SleepPlanPage {
  public currentSleep: SleepHabit = new SleepHabit();
  public sleepPlan: SleepPlan;
  public sleepPlanDetails: string = 'guidelines';
  constructor(
    private _alertCtrl: AlertController,
    private _fitSvc: FitnessService,
    private _sleepSvc: SleepService
  ) { }

  public saveSleep(): void {
    this._sleepSvc.saveSleep(this.sleepPlan, this.currentSleep);
  }

  public setBedtime(): void {
    this.currentSleep = Object.assign({}, this.currentSleep, { bedTime: this._sleepSvc.getBedtime(this.currentSleep.wakeUpTime) });
  }

  public setWakeUptime(): void {
    this.currentSleep = Object.assign({}, this.currentSleep, { wakeUpTime: this._sleepSvc.getWakeUptime(this.currentSleep.bedTime) });
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
            }
          }
        ]
      }).present();
    });
  }

  ionViewWillEnter(): void {
    this._sleepSvc.getSleepPlan$().subscribe((sleepPlan: SleepPlan) => {
      console.log('Received sleep plan: ', sleepPlan);
      this.sleepPlan = Object.assign({}, sleepPlan);
      this.currentSleep = Object.assign({}, this._sleepSvc.getCurrentSleep(this.sleepPlan));
    });
  }
}
