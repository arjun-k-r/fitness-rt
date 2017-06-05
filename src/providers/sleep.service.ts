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
import { SleepHabit, SleepPlan } from '../models';

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

  /**
   * Verifies if the bedtime of a sleeping habit is healthy
   * @desc It is important to go to sleep by 10 p.m. every night. Why? This is because our adrenal glands kick in for a "second wind" to keep us going from 11 pm to 1 am. This puts tremendous stress on the adrenals. When we rest early, our adrenals are rested. Between 10 p.m. and 1 a.m., our adrenals work the hardest to repair the body. We should also try to sleep in until 8:30 a.m. or 9: 00 a.m. if possible. This is because our cortisol level rises to its peak from 6:00 a.m. to 8:00 a.m. to wake us up and get us going for the day. (https://www.drlam.com/articles/adrenal_fatigue.asp)
   * @param {SleepHabit} sleep - The sleep habit to check
   * @returns {boolean} Returns false if the bedtime is after 10:00 p.m.
   */
  private _checkBedtime(sleep: SleepHabit): boolean {
    return moment(sleep.bedTime, 'hours').hours() < 22;
  }

  /**
   * Verifies if the sleep was long enough
   * @desc We need to catch 4-5 complete 90-minute REM sleep cycles (6-7.5 hours).
   * @param {SleepHabit} sleep - The sleep habit to check
   * @returns {boolean} Returns false if the sleep is less than 6 hours
   */
  private _checkDuration(sleep: SleepHabit): boolean {
    return moment(sleep.wakeUpTime, 'hours').subtract(moment(sleep.bedTime, 'hours').hours(), 'hours').hours() > 6;
  }

  /**
   * Verifies if there were any electronics (blue light exposure) used before bedtime
   * @desc Electornics emit blue light, which is preceived as sunlight by the body and disrupts the circadian rhythm (internal clock)
   * @param {SleepPlan} sleepPlan - The sleep plan to check
   * @returns {boolean} Returns false if the sleep is irregular
   */
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

    return (sleepPlan.sleepOscillation <= 1 || sleepPlan.sleepOscillation >= -1);
  }

  /**
   * Verifies if the sleep plan is healthy
   * @param {SleepPlan} sleepPlan - The sleep plan to verify
   * @returns {boolean} Returns false if the sleep is imbalanced
   */
  private _checkSleep(sleepPlan: SleepPlan): boolean {
    return this._checkBedtime(sleepPlan.sleepPattern[0]) && this._checkDuration(sleepPlan.sleepPattern[0]) && this._checkOscillation(sleepPlan);
  }

  /**
   * Establishes the proper bed time by the wake up time
   * @description We need to sleep 4-5 complete 90-minute REM sleep cycles for optimal health
   * @param {string} wakeUpTime The wake up time to set the bed time for
   * @returns {string} The returns the bed time
   */
  public getBedtime(wakeUpTime: string): string {
    return moment(wakeUpTime, 'hours')
      .subtract({ 'hours': 7, 'minutes': 30 })
      .format('HH:mm');
  }

  /**
   * @param {SleepPlan} sleepPlan - The sleep plan that stores the last 7 days sleeping habits
   * @returns {SleepHabit} Returns the last night's sleep or the next sleep
   */
  public getCurrentSleep(sleepPlan: SleepPlan): SleepHabit {
    if (!!sleepPlan.sleepPattern[0] && sleepPlan.sleepPattern[0].date === CURRENT_DAY) {
      return sleepPlan.sleepPattern[0];
    } else {
      if (sleepPlan.sleepPattern.length === 7) {
        sleepPlan.sleepPattern.pop();
      }
      sleepPlan.sleepPattern.unshift(new SleepHabit());
      sleepPlan.sleepPattern[0].date = CURRENT_DAY;

      // Check if the sleep plan is imbalanced
      if (sleepPlan.imbalancedSleep) {
        sleepPlan.daysOfImbalance++;
      } else {
        sleepPlan.daysOfImbalance = 0;
      }
      return sleepPlan.sleepPattern[0];
    }
  }

  /**
   * @returns {Observable} Returns an observable that provides the sleep plan
   */
  public getSleepPlan$(): Observable<SleepPlan> {
    return new Observable((observer: Observer<SleepPlan>) => this._sleepPlan.subscribe((sleepPlan: SleepPlan) => observer.next(sleepPlan['$value'] === null ? new SleepPlan() : sleepPlan)));
  }

  /**
   * Establishes the proper wake up time by the bed time
   * @description We need to sleep 4-5 complete 90-minute REM sleep cycles for optimal health
   * @param {string} bedTime The bed time to set the wake up time for
   * @returns {string} The returns the wake up time
   */
  public getWakeUptime(bedTime: string): string {
    return moment(bedTime, 'hours')
      .add({ 'hours': 7, 'minutes': 30 })
      .format('HH:mm');
  }

  public saveSleep(sleepPlan: SleepPlan, sleepHabit: SleepHabit): void {
    sleepHabit.duration = moment(sleepHabit.wakeUpTime, 'hours')
      .subtract(moment(sleepHabit.bedTime, 'hours').hours(), 'hours').hours();
    sleepPlan.sleepPattern[0] = Object.assign({}, sleepHabit);
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
