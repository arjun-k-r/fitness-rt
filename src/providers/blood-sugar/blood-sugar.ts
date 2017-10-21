// Angular
import { Injectable } from '@angular/core';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { BloodSugar, BloodSugarLog } from '../../models';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class BloodSugarProvider {
  constructor(
    private _db: AngularFireDatabase
  ) { }

  public getBloodSugar$(authId: string): FirebaseObjectObservable<BloodSugarLog> {
    return this._db.object(`/blood/sugar/${authId}/${CURRENT_DAY}`);
  }

  public getBloodSugarLog$(authId: string): FirebaseListObservable<BloodSugarLog[]> {
    return this._db.list(`/blood-sugar-log/${authId}/`, {
      query: {
        limitToLast: 7
      }
    });
  }

  public getIdealBloodSugar(unit: string): BloodSugar {
    if (unit === 'mg/dL') {
      return new BloodSugar(120, 100, 140, 110);
    } else {
      return new BloodSugar(6.66, 5.55, 7.77, 6.11);
    }
  }

  public saveBloodSugar(authId: string, bloodSugar: BloodSugarLog, weekLog: BloodSugarLog[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      const weekLength: number = weekLog.length;
      if (!!weekLength) {
        if (bloodSugar.date !== weekLog[weekLength - 1].date) {
          weekLog.push(bloodSugar);
        } else {
          weekLog[weekLength - 1] = Object.assign({}, bloodSugar);
        }
      } else {
        weekLog.push(bloodSugar);
      }
      Promise.all([
        this._db.object(`/blood-sugar-log/${authId}/`).set(weekLog),
        this._db.object(`/blood/sugar/${authId}/${CURRENT_DAY}`).set(bloodSugar)
      ]).then(() => {
        resolve();
      }).catch((err: firebase.FirebaseError) => reject(err));
    });
  }

}
