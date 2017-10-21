// Angular
import { Injectable } from '@angular/core';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { BloodPressure, BloodPressureLog, Fitness } from '../../models';

// Providers
import { FitnessProvider } from '../fitness/fitness';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class BloodPressureProvider {
  constructor(
    private _db: AngularFireDatabase,
    private _fitPvd: FitnessProvider
  ) { }

  public getBloodPressure$(authId: string): FirebaseObjectObservable<BloodPressureLog> {
    return this._db.object(`/blood/pressure/${authId}/${CURRENT_DAY}`);
  }

  public getBloodPressureLog$(authId: string): FirebaseListObservable<BloodPressureLog[]> {
    return this._db.list(`/blood-pressure-log/${authId}/`, {
      query: {
        limitToLast: 7
      }
    });
  }

  public getIdealBloodPressure(authId: string): Promise<BloodPressure> {
    return new Promise((resolve, reject) => {
      this._fitPvd.getFitness$(authId).subscribe((fitness: Fitness) => {
        let idealBloodPressure: BloodPressure = new BloodPressure();
        if (fitness['$value'] !== null) {
          if (fitness.age < 1) {
            idealBloodPressure = new BloodPressure(70, 100);
          } else if (fitness.age <= 5) {
            idealBloodPressure = new BloodPressure(80, 110);
          } else if (fitness.age <= 12) {
            idealBloodPressure = new BloodPressure(80, 120);
          } else if (fitness.age <= 18) {
            idealBloodPressure = new BloodPressure(90, 140);
          } else {
            idealBloodPressure = new BloodPressure(90, 130);
          }
        }
        resolve(idealBloodPressure);
      }, (err: firebase.FirebaseError) => reject(err))
    });
  }

  public saveBloodPressure(authId: string, bloodPressure: BloodPressureLog, weekLog: BloodPressureLog[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      const weekLength: number = weekLog.length;
      if (!!weekLength) {
        if (bloodPressure.date !== weekLog[weekLength - 1].date) {
          weekLog.push(bloodPressure);
        } else {
          weekLog[weekLength - 1] = Object.assign({}, bloodPressure);
        }
      } else {
        weekLog.push(bloodPressure);
      }
      Promise.all([
        this._db.object(`/blood-pressure-log/${authId}/`).set(weekLog),
        this._db.object(`/blood/pressure/${authId}/${CURRENT_DAY}`).set(bloodPressure)
      ]).then(() => {
        resolve();
      }).catch((err: firebase.FirebaseError) => reject(err));
    });
  }

}
