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
import { SleepPlan } from '../models';

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

  public getSleepPlan(): Observable<SleepPlan> {
    return new Observable((observer: Observer<SleepPlan>) => this._sleepPlan.subscribe((sleepPlan: SleepPlan) => observer.next(sleepPlan['$value'] === null ?  new SleepPlan() : sleepPlan)));
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

}
