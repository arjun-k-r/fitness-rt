// Angular
import { Injectable } from '@angular/core';

// Ionic
import { Storage } from '@ionic/storage';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Sleep, SleepLog } from '../../models';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class SleepProvider {
  constructor(
    private _db: AngularFireDatabase,
    private _storage: Storage
  ) { }

  public checkLifePoints(sleep: Sleep): number {
    let lifePoints: number = 0;
    if (sleep.combos.noElectronics) {
      lifePoints += 5;
    } else {
      lifePoints -= 5;
    }

    if (sleep.combos.noStimulants) {
      lifePoints += 5;
    } else {
      lifePoints -= 5;
    }

    if (sleep.combos.relaxation) {
      lifePoints += 5;
    } else {
      lifePoints -= 5;
    }

    if (sleep.combos.quality > 5) {
      lifePoints += 10;
    } else {
      lifePoints -= 10;
    }

    if (sleep.duration > 7) {
      lifePoints += 20;
    } else {
      lifePoints -= 20;
    }

    if (moment(sleep.bedTime, 'HH:mm').hours() < 22) {
      lifePoints += 20;
    } else {
      lifePoints -= 20;
    }

    return lifePoints;
  }

  public getSleep$(authId: string): FirebaseObjectObservable<Sleep> {
    return this._db.object(`/sleep/${authId}/${CURRENT_DAY}`);
  }

  public getSleepLog$(authId: string): FirebaseListObservable<SleepLog[]> {
    return this._db.list(`/sleep-log/${authId}/`, {
      query: {
        limitToLast: 7
      }
    });
  }

  public saveSleep(authId: string, sleep: Sleep, weekLog: SleepLog[]): firebase.Promise<void> {
    this._storage.ready().then(() => {
      this._storage.set(`sleepLifePoints-${CURRENT_DAY}`, sleep.lifePoints)
        .catch((err: Error) => console.error(`Error storing sleep lifepoints: ${err.toString()}`));
    }).catch((err: Error) => console.error(`Error loading storage: ${err.toString()}`));
    const newSleepLog: SleepLog = new SleepLog(sleep.bedTime, moment().format('dddd'), sleep.duration, sleep.combos.quality);
    if (!!weekLog.length) {
     if (newSleepLog.date !== weekLog[0].date) {
      this._db.list(`/sleep-log/${authId}/`).push(newSleepLog).catch((err: firebase.FirebaseError) => console.error(`Error saving sleep log: ${err.message}`));
     } else {
      this._db.list(`/sleep-log/${authId}/`).update(weekLog[0]['$key'], newSleepLog).catch((err: firebase.FirebaseError) => console.error(`Error saving sleep log: ${err.message}`));
     }
    } else {
      this._db.list(`/sleep-log/${authId}/`).push(newSleepLog).catch((err: firebase.FirebaseError) => console.error(`Error saving sleep log: ${err.message}`));
    }
    return this._db.object(`/sleep/${authId}/${CURRENT_DAY}`).set(sleep);
  }
}
