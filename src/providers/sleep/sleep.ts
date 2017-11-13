// Angular
import { Injectable } from '@angular/core';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
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

  public getPrevSleep$(authId: string): FirebaseObjectObservable<Sleep> {
    return this._db.object(`/sleep/${authId}/${CURRENT_DAY - 1}`);
  }

  public getSleep$(authId: string): FirebaseObjectObservable<Sleep> {
    return this._db.object(`/sleep/${authId}/${CURRENT_DAY}`);
  }

  public getSleepLog$(authId: string): FirebaseListObservable<Sleep[]> {
    return this._db.list(`/sleep-log/${authId}/`, {
      query: {
        limitToLast: 7
      }
    });
  }

  public saveSleep(authId: string, sleep: Sleep, weekLog: Sleep[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      const weekLength: number = weekLog.length;
      const newSleepLog: Sleep = Object.assign({}, sleep, { date: moment().format('dddd') });
      if (!!weekLength) {
        if (newSleepLog.date !== weekLog[weekLength - 1].date) {
          weekLog.push(newSleepLog);
        } else {
          weekLog[weekLength - 1] = Object.assign({}, newSleepLog);
        }
      } else {
        weekLog.push(newSleepLog);
      }
      Promise.all([
        this._db.object(`/sleep-log/${authId}/`).set(weekLog),
        this._db.object(`/sleep/${authId}/${CURRENT_DAY}`).set(sleep)
      ]).then(() => {
        resolve();
      }).catch((err: firebase.FirebaseError) => reject(err));
    });
  }
}
