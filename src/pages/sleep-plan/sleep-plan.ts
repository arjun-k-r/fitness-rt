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
  public isDirty: boolean = false;
  public sleepPlan: SleepPlan;
  public sleepPlanDetails: string = 'guidelines';
  constructor(
    private _alertCtrl: AlertController,
    private _fitSvc: FitnessService,
    private _sleepSvc: SleepService
  ) { }

  public changedTime(): void {
    if (this.currentSleep.bedTime !== this.sleepPlan.sleepPattern[0].bedTime || this.currentSleep.wakeUpTime !== this.sleepPlan.sleepPattern[0].wakeUpTime) {
      this.currentSleep.duration = this._sleepSvc.getSleepDuration(this.currentSleep);
      this.isDirty = true;
    }
  }

  public saveSleep(): void {
    this._sleepSvc.saveSleep(this.sleepPlan, this.currentSleep);
    this.isDirty = false;
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
            text: 'Done'
          }
        ]
      }).present();
    });
  }

  ionViewCanLeave(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isDirty) {
        this._alertCtrl.create({
          title: 'Discard changes',
          message: 'Changes have been made. Are you sure you want to leave?',
          buttons: [
            {
              text: 'Yes',
              handler: () => {
                resolve(true);
              }
            },
            {
              text: 'No',
              handler: () => {
                reject(true);
              }
            }
          ]
        }).present();
      } else {
        resolve(true);
      }
    });
  }

  ionViewWillEnter(): void {
    this._sleepSvc.getSleepPlan$().subscribe((sleepPlan: SleepPlan) => {
      this.sleepPlan = Object.assign({}, sleepPlan);
      this.currentSleep = Object.assign({}, this._sleepSvc.getCurrentSleep(this.sleepPlan));
    });
  }
}
