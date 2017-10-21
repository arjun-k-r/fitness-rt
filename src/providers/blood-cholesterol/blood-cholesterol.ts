// Angular
import { Injectable } from '@angular/core';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { BloodCholesterol, BloodCholesterolLog } from '../../models';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class BloodCholesterolProvider {
  constructor(
    private _db: AngularFireDatabase
  ) { }

  public getBloodCholesterol$(authId: string): FirebaseObjectObservable<BloodCholesterolLog> {
    return this._db.object(`/blood/cholesterol/${authId}/${CURRENT_DAY}`);
  }

  public getBloodCholesterolLog$(authId: string): FirebaseListObservable<BloodCholesterolLog[]> {
    return this._db.list(`/blood-cholesterol-log/${authId}/`, {
      query: {
        limitToLast: 7
      }
    });
  }

  public getIdealBloodCholesterol(unit: string): BloodCholesterol {
    if (unit === 'mg/dL') {
      return new BloodCholesterol(60, 130, 200, 150);
    } else {
      return new BloodCholesterol(1.5516, 3.3618, 5.172, 1.6935);
    }
  }

  public saveBloodCholesterol(authId: string, bloodCholesterol: BloodCholesterolLog, weekLog: BloodCholesterolLog[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      const weekLength: number = weekLog.length;
      if (!!weekLength) {
        if (bloodCholesterol.date !== weekLog[weekLength - 1].date) {
          weekLog.push(bloodCholesterol);
        } else {
          weekLog[weekLength - 1] = Object.assign({}, bloodCholesterol);
        }
      } else {
        weekLog.push(bloodCholesterol);
      }
      Promise.all([
        this._db.object(`/blood-cholesterol-log/${authId}/`).set(weekLog),
        this._db.object(`/blood/cholesterol/${authId}/${CURRENT_DAY}`).set(bloodCholesterol)
      ]).then(() => {
        resolve();
      }).catch((err: firebase.FirebaseError) => reject(err));
    });
  }

}
