// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Subject } from 'rxjs/Subject';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { FirebaseError } from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Sleep } from '../../models';

const CURRENT_DAY: string = moment().format('YYYY-MM-DD');
@Injectable()
export class SleepProvider {
  private _trendDaysSubject: Subject<any> = new Subject();
  constructor(
    private _db: AngularFireDatabase
  ) { }

  public calculateIdealSleep(age: number): string {
    if (age < 1) {
      return '14-17';
    } else if (age < 3) {
      return '11-14';
    } else if (age < 6) {
      return '10-13';
    } else if (age < 14) {
      return '9-11';
    } else if (age < 18) {
      return '8-10';
    } else if (age < 65) {
      return '7-9';
    }

    return '7-8';
  }

  public changeTrendDays(days: number): void {
    this._trendDaysSubject.next(days);
  }

  public getSleep$(authId: string, date?: string): FirebaseObjectObservable<Sleep> {
    return this._db.object(`/${authId}/sleep/${date || CURRENT_DAY}`);
  }

  public getTrends$(authId: string, days?: number): FirebaseListObservable<Sleep[]> {
    setTimeout(() => {
      this.changeTrendDays(days);
    });
    return this._db.list(`/${authId}/trends/sleep/`, {
      query: {
        limitToLast: this._trendDaysSubject
      }
    });
  }

  public saveSleep(authId: string, sleep: Sleep, trends: Sleep[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      const trend: Sleep = trends.find((s: Sleep) => s.date === sleep.date);
      if (trend) {
        this._db.list(`/${authId}/trends/sleep/`).update(trend['$key'], sleep);
      } else {
        this._db.list(`/${authId}/trends/sleep/`).push(sleep);
      }
      this._db.object(`/${authId}/sleep/${sleep.date}`).set(sleep).then(() => {
        resolve();
      }).catch((err: FirebaseError) => reject(err));
    });
  }

}
