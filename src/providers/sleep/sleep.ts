// Angular
import { Injectable } from '@angular/core';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Sleep } from '../../models';

const CURRENT_DAY: string = moment().format('YYYY-MM-DD');
@Injectable()
export class SleepProvider {
  constructor(
    private _db: AngularFireDatabase
  ) { }

  public getSleep$(authId: string, date?: string): FirebaseObjectObservable<Sleep> {
    return this._db.object(`/sleep/${authId}/${date || CURRENT_DAY}`);
  }

  public getTrends$(authId: string, days?: number): FirebaseListObservable<Sleep[]> {
    return this._db.list(`/sleep/${authId}/`, {
      query: {
        limitToLast: days || 7
      }
    });
  }

  public saveSleep(authId: string, sleep: Sleep, trends: Sleep[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      if (!!trends.length) {
        trends.reverse();
        if (CURRENT_DAY !== trends[0].date) {
          this._db.list(`/trends/sleep/${authId}/`).push(sleep);
        } else {
          this._db.list(`/trends/sleep/${authId}/`).update(trends[0]['$key'], sleep);
        }
      } else {
        this._db.list(`/trends/sleep/${authId}/`).push(sleep)
      }
      this._db.object(`/sleep/${authId}/${sleep.date}`).set(sleep).then(() => {
        resolve();
      }).catch((err: firebase.FirebaseError) => reject(err));
    });
  }

}
