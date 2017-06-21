// App
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { User } from '@ionic/cloud-angular';
import 'rxjs/operator/map';

// Third-party
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import * as moment from 'moment';

// Models
import { SleepHabit, SleepPlan, WarningMessage } from '../models';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class SleepService {
  private _sleepPlan: FirebaseObjectObservable<SleepPlan>;
  constructor(
    private _db: AngularFireDatabase,
    private _user: User
  ) {
    this._sleepPlan = _db.object(`/sleep-plan/${_user.id}/`);
  }

  private _checkBedtime(sleep: SleepHabit): boolean {
    if (moment(sleep.bedTime, 'hours').hours() > 22) {
      sleep.warnings.push(new WarningMessage(
        'Your bedtime is too late',
        'You need to go to bed before 10:00 p.m., because between 10:00 p.m. and 01:00 a.m. our adrenals work to repair the body'
      ));

      return false;
    }
    return true;
  }

  private _checkDuration(sleep: SleepHabit): boolean {
    if (sleep.duration < 6) {
      sleep.warnings.push(new WarningMessage(
        'Insufficient sleep',
        'You need to catch 4-5 complete 90-minute sleep cycles (7-8 hours of casual sleep)'
      ));
      return false;
    }

    return true;
  }

  private _checkOscillation(sleepPlan: SleepPlan): boolean {
    let currDayBedtime: number = moment(sleepPlan.sleepPattern[0].bedTime, 'hours').hours(),
      prevBedtime: number,
      prevDaySleep: SleepHabit;

    sleepPlan.sleepOscillation = sleepPlan.sleepPattern.reduce((acc: number, currHabit: SleepHabit, currIdx: number) => {
      if (currIdx < 6) {
        prevDaySleep = sleepPlan.sleepPattern[currIdx + 1];
        prevBedtime = moment((!!prevDaySleep ? prevDaySleep.bedTime : currDayBedtime), 'hours').hours();
        acc += (moment(currHabit.bedTime, 'hours').hours() - prevBedtime);
      }

      return acc;
    }, 0);

    if ((sleepPlan.sleepOscillation > 1 || sleepPlan.sleepOscillation < -1)) {
      sleepPlan.sleepPattern[0].warnings.push(new WarningMessage(
        'You bedtime is too variable',
        'You need to go to bed around the same hour every night to set your circadian rhythm (internal clock)'
      ));
      return false
    }

    return true;
  }

  private _checkSleep(sleepPlan: SleepPlan): boolean {
    sleepPlan.sleepPattern[0].warnings = [];
    this._checkBedtime(sleepPlan.sleepPattern[0]);
    this._checkDuration(sleepPlan.sleepPattern[0]);
    this._checkOscillation(sleepPlan);

    return !sleepPlan.sleepPattern[0].warnings.length;
  }

  public getCurrentSleep(sleepPlan: SleepPlan): SleepHabit {
    if (!!sleepPlan.sleepPattern[0] && sleepPlan.sleepPattern[0].date === CURRENT_DAY) {
      return sleepPlan.sleepPattern[0];
    } else {
      if (sleepPlan.sleepPattern.length === 7) {
        sleepPlan.sleepPattern.pop();
      }

      sleepPlan.sleepPattern.unshift(new SleepHabit(
        sleepPlan.sleepPattern[0].bedTime,
        CURRENT_DAY,
        sleepPlan.sleepPattern[0].duration,
        sleepPlan.sleepPattern[0].wakeUpTime
      ));
      
      if (sleepPlan.imbalancedSleep) {
        sleepPlan.daysOfImbalance++;
      } else {
        sleepPlan.daysOfImbalance = 0;
      }

      return sleepPlan.sleepPattern[0];
    }
  }

  public getSleepDuration(sleep: SleepHabit): number {
    let bedHM: Array<string> = sleep.bedTime.split(':'),
      wakeHM: Array<string> = sleep.wakeUpTime.split(':');
      return 24 - (+bedHM[0] + +bedHM[1] / 60) + (+wakeHM[0] + +wakeHM[1] / 60);
  }

  public getSleepPlan$(): Observable<SleepPlan> {
    return new Observable((observer: Observer<SleepPlan>) => this._sleepPlan.subscribe((sleepPlan: SleepPlan) => observer.next(sleepPlan['$value'] === null ? new SleepPlan() : sleepPlan)));
  }

  public saveSleep(sleepPlan: SleepPlan, sleepHabit: SleepHabit): void {
    console.log('Saving sleep plan: ', sleepPlan);

    sleepPlan.imbalancedSleep = !this._checkSleep(sleepPlan);

    this._sleepPlan.update({
      daysOfImbalance: sleepPlan.daysOfImbalance,
      imbalancedSleep: sleepPlan.imbalancedSleep,
      sleepOscillation: sleepPlan.sleepOscillation,
      sleepPattern: sleepPlan.sleepPattern
    });
  }
}
