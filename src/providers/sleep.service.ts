// App
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { User } from '@ionic/cloud-angular';
import 'rxjs/operator/map';

// Third-party
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import * as moment from 'moment';
import * as _ from 'lodash';

// Models
import { SleepHabit, SleepPlan, WarningMessage } from '../models';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class SleepService {
  private _sleepPlan: FirebaseObjectObservable<SleepPlan>;
  constructor(
    private _af: AngularFire,
    private _user: User
  ) {
    this._sleepPlan = _af.database.object(`/sleep-plan/${_user.id}/${CURRENT_DAY}`);
  }

  /**
   * Verifies if the bedtime of a sleeping habit is healthy
   * @desc We need to go to bed before 10:00 pm for a refreshing, healthy, good night sleep. Between 10:00 pm and 02:00 is the time of vata during which there is an abundance of hormone secretion from the adrenal glands, including stress hormones which keep us alert
   * @param {SleepHabit} sleep - The sleep habit to check
   * @returns {WarningMessage} Returns a warning if something is wrong
   */
  private _checkBedtime(sleep: SleepHabit): WarningMessage {
    return moment(sleep.bedTime, 'hours').hours() > 22 ? new WarningMessage(
      'You need to go to bed before 10:00 pm',
      'Between 10:00 pm and 02:00 am, is time of vata energy. This causes the adrenal glands to secrete hormones, including stress hormones that keep us alert'
    ) : null;
  }

  /**
   * Verifies if the sleep plan is healthy
   * @param {SleepPlan} sleepPlan - The sleep plan to verify
   * @returns {Promise} Returns confirmation if the sleep is healthy or not
   */
  private _checkSleep(sleepPlan: SleepPlan): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let currentSleep: SleepHabit = sleepPlan.sleepPattern[0],
        sleepBedtimeWarning: WarningMessage = this._checkBedtime(currentSleep),
        sleepElectronicsWarning: WarningMessage,
        sleepOscillationWarning: WarningMessage,
        sleepRelaxationWarning: WarningMessage;

      if (!!sleepBedtimeWarning) {
        currentSleep.warnings.push(sleepBedtimeWarning);
      }

      if (!!sleepElectronicsWarning) {
        currentSleep.warnings.push(sleepElectronicsWarning);
      }

      if (!!sleepOscillationWarning) {
        currentSleep.warnings.push(sleepOscillationWarning);
      }

      if (!!sleepRelaxationWarning) {
        currentSleep.warnings.push(sleepRelaxationWarning);
      }

      if (!currentSleep.warnings.length) {
        resolve(true);
      } else {
        reject(currentSleep.warnings);
      }
    });
  }

  /**
   * Establishes the proper bed time by the wake up time
   * @description We need to sleep 4-5 complete 90-minute REM sleep cycles for optimal health
   * @param {string} wakeUpTime The wake up time to set the bed time for
   * @returns {string} The returns the bed time
   */
  public getBedtime(wakeUpTime: string): string {
    let wakeTimeItems = wakeUpTime.split(':'),
      hhWake = +wakeTimeItems[0],
      mmWake = +wakeTimeItems[1];

    return moment({ 'hours': hhWake, 'minutes': mmWake })
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
      sleepPlan.sleepPattern.pop();
      sleepPlan.sleepPattern.unshift(new SleepHabit());
      sleepPlan.sleepPattern[0].date = CURRENT_DAY;
      return sleepPlan.sleepPattern[0];
    }
  }

  /**
   * @returns {Observable} Returns an observable that provides the sleep plan
   */
  public getSleepPlan(): Observable<SleepPlan> {
    return new Observable((observer: Observer<SleepPlan>) => this._sleepPlan.subscribe((sleepPlan: SleepPlan) => observer.next(sleepPlan['$value'] === null ? new SleepPlan() : sleepPlan)));
  }

  /**
   * Establishes the proper wake up time by the bed time
   * @description We need to sleep 4-5 complete 90-minute REM sleep cycles for optimal health
   * @param {string} bedTime The bed time to set the wake up time for
   * @returns {string} The returns the wake up time
   */
  public getWakeUptime(bedTime: string): string {
    let bedTimeItems = bedTime.split(':'),
      hhSleep = +bedTimeItems[0],
      mmSleep = +bedTimeItems[1];

    return moment({ 'hours': hhSleep, 'minutes': mmSleep })
      .add({ 'hours': 7, 'minutes': 30 })
      .format('HH:mm');
  }

  public saveSleep(sleepPlan: SleepPlan, sleepHabit: SleepHabit): Promise<boolean> {
    return new Promise((resolve, reject) => {
      sleepPlan.sleepPattern[0] = sleepHabit;
      let currBedtime: number = moment(sleepPlan.sleepPattern[0].bedTime, 'hours').hours(),
        prevBedtime: number,
        prevSleep: SleepHabit;

      sleepPlan.sleepOscillation = sleepPlan.sleepPattern.reduce((acc: number, currHabit: SleepHabit, currIdx: number) => {
        if (currIdx < 6) {
          prevSleep = sleepPlan.sleepPattern[currIdx + 1];
          prevBedtime = moment((!!prevSleep ? prevSleep.bedTime : currBedtime), 'hours').hours();
          return acc += moment(currHabit.bedTime, 'hours').subtract(prevBedtime, 'hours').hours();
        }
      }, 0);

      this._checkSleep(sleepPlan).then((isGood: boolean) => {
        this._sleepPlan.update({
          sleepOscillation: sleepPlan.sleepOscillation,
          sleepPattern: sleepPlan.sleepPattern
        });

        resolve(true);
      }).catch((warnings: Array<WarningMessage>) => {
        sleepPlan.sleepPattern[0].warnings = [...warnings];

        this._sleepPlan.update({
          sleepOscillation: sleepPlan.sleepOscillation,
          sleepPattern: sleepPlan.sleepPattern
        });

        reject(warnings);
      });
    });
  }
}
