// Angular
import { Injectable } from '@angular/core';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Sleep } from '../../models';

const CURRENT_DAY: string = moment().format('DD-MM-YYYY');
@Injectable()
export class SleepProvider {

  constructor(
    private _db: AngularFireDatabase
  ) { }

  public getSleep$(authId: string): FirebaseObjectObservable<Sleep> {
    return this._db.object(`/sleep/${authId}/${CURRENT_DAY}`);
  }

  public getTrends$(authId: string, days: number): FirebaseListObservable<Sleep[]> {
    return this._db.list(`/sleep/${authId}/`, {
      query: {
        limitToLast: days || 7
      }
    });
  }

}
