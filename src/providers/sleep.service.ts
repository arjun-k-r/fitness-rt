// App
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { User } from '@ionic/cloud-angular';
import 'rxjs/operator/map';

// Third-party
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import * as moment from 'moment';

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
   * Verifies if the sleep was long enough
   * @desc We need to catch 4-5 complete 90-minute REM sleep cycles (07:30 hours).
   * @param {SleepHabit} sleep - The sleep habit to check
   * @returns {WarningMessage} Returns a warning if something is wrong
   */
  private _checkDuration(sleep: SleepHabit): WarningMessage {
    return moment(sleep.wakeUpTime, 'hours').subtract(moment(sleep.bedTime, 'hours').hours(), 'hours').hours() < 6 ? new WarningMessage(
      'We need at least 6 hours of sleep every night',
      'There are two tyes of sleep: REM (rapid eye movement or deep sleep) and non-REM (light sleep). The transition between these two types of sleep is a 90-minute cycle. We need to wake up during one of these transitions in order to feel refreshed and energized, more precisely after 4-5 complete cycles (07:30 hours).'
    ) : null;
  }

  /**
   * Verifies if there were any electronics (blue light exposure) used before bedtime
   * @desc Electornics emit blue light, which is preceived as sunlight by the body and disrupts the circadian rhythm (internal clock)
   * @param {SleepHabit} sleep - The sleep habit to check
   * @returns {WarningMessage} Returns a warning if something is wrong
   */
  private _checkElectronics(sleep: SleepHabit): WarningMessage {
    return !sleep.noElectronics ? new WarningMessage(
      'No electronics 1 hours before bed',
      'Electornics emit blue light, which is preceived as sunlight by the body and disrupts the circadian rhythm (internal clock). This will keep you from falling asleep and your sleep will be unrefreshing.'
    ) : null;
  }

  /**
   * Verifies if there were any electronics (blue light exposure) used before bedtime
   * @desc Electornics emit blue light, which is preceived as sunlight by the body and disrupts the circadian rhythm (internal clock)
   * @param {SleepPlan} sleepPlan - The sleep plan to check
   * @returns {WarningMessage} Returns a warning if something is wrong
   */
  private _checkOscillation(sleepPlan: SleepPlan): WarningMessage {
    let currDayBedtime: number = moment(sleepPlan.sleepPattern[0].bedTime, 'hours').hours(),
      prevBedtime: number,
      prevDaySleep: SleepHabit;

    sleepPlan.sleepOscillation = sleepPlan.sleepPattern.reduce((acc: number, currHabit: SleepHabit, currIdx: number) => {
      if (currIdx < 6) {
        prevDaySleep = sleepPlan.sleepPattern[currIdx + 1];
        prevBedtime = moment((!!prevDaySleep ? prevDaySleep.bedTime : currDayBedtime), 'hours').hours();
        return acc += moment(currHabit.bedTime, 'hours').subtract(prevBedtime, 'hours').hours();
      }
    }, 0);

    return (sleepPlan.sleepOscillation > 1 || sleepPlan.sleepOscillation < -1) ? new WarningMessage(
      'You need to respect your sleep routine',
      "Going to bed and waking up at the same hour every day teaches your bed to set up its circadian rhythm (internal clock). All metabolic processes function according to the body's internal clock."
    ) : null;
  }

  /**
   * Verifies if there was relaxation (no working or stress) before bed time
   * @desc Sleep preparation routine is as important as sleeping itself. Working or stressing before bedtime will make your body secrete stress hormones, which will keep you alert and keep you from falling asleep. You will also feel unrefreshed in the morning.
   * @param {SleepHabit} sleep - The sleep habit to check
   * @returns {WarningMessage} Returns a warning if something is wrong
   */
  private _checkRelaxation(sleep: SleepHabit): WarningMessage {
    return !sleep.noElectronics ? new WarningMessage(
      'You need to relax before bed',
      'Sleep preparation routine is as important as sleeping itself. Working or stressing before bedtime will make your body secrete stress hormones, which will keep you alert and keep you from falling asleep. You will also feel unrefreshed in the morning.'
    ) : null;
  }

  /**
   * Verifies if there were stimulants consumed before bed
   * @desc Stimulants (e.g. coffee, black tea, green tea, alcohol, tobacco etc.), as their name suggests, stimulate blood flow throughout the body and keep you alert both mentally and physically.
   * @param {SleepHabit} sleep - The sleep habit to check
   * @returns {WarningMessage} Returns a warning if something is wrong
   */
  private _checkStimulants(sleep: SleepHabit): WarningMessage {
    return !sleep.noStimulants ? new WarningMessage(
      'You need to avoid stimulants at least 6 hours before bed',
      'Stimulants (e.g. coffee, black tea, green tea, alcohol, tobacco etc.), as their name suggests, stimulate blood flow throughout the body and keep you alert both mentally and physically.'
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
        sleepDurationWarning: WarningMessage = this._checkDuration(currentSleep),
        sleepElectronicsWarning: WarningMessage = this._checkElectronics(currentSleep),
        sleepOscillationWarning: WarningMessage = this._checkOscillation(sleepPlan),
        sleepRelaxationWarning: WarningMessage = this._checkRelaxation(currentSleep),
        sleepStimulantsWarning: WarningMessage = this._checkStimulants(currentSleep);

      if (!!sleepBedtimeWarning) {
        currentSleep.warnings.push(sleepBedtimeWarning);
      }

      if (!!sleepDurationWarning) {
        currentSleep.warnings.push(sleepDurationWarning);
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

      if (!!sleepStimulantsWarning) {
        currentSleep.warnings.push(sleepStimulantsWarning);
      }

      if (!!sleepBedtimeWarning || !!sleepDurationWarning) {
        sleepPlan.poorSleep++;
      }

      if (!!sleepElectronicsWarning || !!sleepOscillationWarning || !!sleepRelaxationWarning || !!sleepStimulantsWarning) {
        sleepPlan.notRefreshing++;
      }

      if (!currentSleep.warnings.length) {
        resolve(true);
        sleepPlan.notRefreshing = 0;
        sleepPlan.poorSleep = 0;
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
      sleepPlan.sleepPattern.pop();
      sleepPlan.sleepPattern.unshift(new SleepHabit());
      sleepPlan.sleepPattern[0].date = CURRENT_DAY;
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

  public saveSleep(sleepPlan: SleepPlan, sleepHabit: SleepHabit): Promise<boolean> {
    return new Promise((resolve, reject) => {
      sleepPlan.sleepPattern[0] = sleepHabit;
      console.log('Saving sleep plan: ', sleepPlan);

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
