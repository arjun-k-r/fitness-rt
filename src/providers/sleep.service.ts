import { Injectable } from '@angular/core';

// Third-party
import * as moment from 'moment';

// Models
import { SleepPlan } from '../models'

@Injectable()
export class SleepService {

  constructor() {}

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
      .format('hh:mm');
  }

  /**
   * Establishes the proper wake up time by the bed time
   * @description We need to sleep 4-5 complete 90-minute REM sleep cycles for optimal health
   * @param {string} bedTime The bed time to set the wake up time for
   * @returns {string} The returns the wake up time
   */
  public getWakeUptime(bedTime: string): string {
    let bedTimeItems = bedTime.split(':'),
      hhSleep = +bedTime[0] + 12,
      mmSleep = +bedTime[1];

    return moment({ 'hours': hhSleep, 'minutes': mmSleep })
      .add({ 'hours': 7, 'minutes': 30 })
      .format('hh:mm');
  }

}
