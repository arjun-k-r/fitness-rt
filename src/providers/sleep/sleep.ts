// Angular
import { Injectable } from '@angular/core';

// Firebase
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Sleep } from '../../models';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class SleepProvider {
  constructor(
    private _db: AngularFireDatabase
  ) { }

  public getSleep$(authId: string): FirebaseObjectObservable<Sleep> {
    return this._db.object(`/sleep/${authId}/${CURRENT_DAY}`);
  }

  public saveSleep(authId: string, sleep: Sleep): firebase.Promise<void> {
    if (!!sleep.weekPlan && !!sleep.weekPlan.length) {
      if (sleep.date !== sleep.weekPlan[0].date) {
        sleep.weekPlan = [sleep, ...sleep.weekPlan.slice(0, 6)];
      } else {
        sleep.weekPlan[0] = Object.assign({}, sleep);
      }
    } else {
      sleep.weekPlan = [sleep];
    }
    return this._db.object(`/sleep/${authId}/${CURRENT_DAY}`).set(sleep);
  }
}
