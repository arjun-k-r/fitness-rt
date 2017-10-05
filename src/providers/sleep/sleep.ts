// Angular
import { Injectable } from '@angular/core';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Sleep, SleepGoals, SleepLog } from '../../models';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class SleepProvider {
  constructor(
    private _db: AngularFireDatabase
  ) { }

  public checkGoalAchievements(goals: SleepGoals, sleep: Sleep): boolean {
    let bedTimeAchieved: boolean = false;
    let sleepDurationAchieved: boolean = false;
    const bedTimeGoal: number = moment.duration(goals.bedTime.value).asMinutes() / 60;
    const bedTime: number = moment.duration(sleep.bedTime).asMinutes() / 60;
    if (goals.bedTime.isSelected && (bedTime => bedTimeGoal - 0.5 || bedTime <= bedTimeGoal + 0.5)) {
      bedTimeAchieved = true;
    } else if (goals.duration.isSelected && (sleep.duration >= goals.duration.value - 0.5 || sleep.duration <= goals.duration.value + 0.5)) {
      sleepDurationAchieved = true;
    }

    return bedTimeAchieved || sleepDurationAchieved;
  }

  public checkGoodSleep(sleep: Sleep): boolean {
    return sleep.combos.noElectronics && sleep.combos.noElectronics && sleep.combos.noStimulants && sleep.combos.quality > 5 && sleep.combos.relaxation && sleep.duration > 7 && moment(sleep.bedTime, 'HH:mm').hours() < 22;
  }

  public checkLifePoints(sleep: Sleep): number {
    let lifePoints: number = 0;

    if (sleep.combos.goalsAchieved) {
      lifePoints += 5;
    }

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

  public getSleepGoals$(authId: string): FirebaseObjectObservable<SleepGoals> {
    return this._db.object(`/sleep/${authId}/goals`);
  }

  public getPrevSleep$(authId: string): FirebaseObjectObservable<Sleep> {
    return this._db.object(`/sleep/${authId}/${CURRENT_DAY - 1}`);
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

  public saveSleep(authId: string, sleep: Sleep, weekLog: SleepLog[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      this._db.object(`/lifepoints/${authId}/${CURRENT_DAY}/sleep`).set(sleep.lifePoints)
        .then(() => {
          const newSleepLog: SleepLog = new SleepLog(sleep.bedTime, moment().format('dddd'), sleep.duration, sleep.combos.quality);
          if (!!weekLog.length) {
            weekLog.reverse();
            if (newSleepLog.date !== weekLog[0].date) {
              this._db.list(`/sleep-log/${authId}/`).push(newSleepLog).catch((err: firebase.FirebaseError) => console.error(`Error saving sleep log: ${err.message}`));
            } else {
              this._db.list(`/sleep-log/${authId}/`).update(weekLog[0]['$key'], newSleepLog).catch((err: firebase.FirebaseError) => console.error(`Error saving sleep log: ${err.message}`));
            }
          } else {
            this._db.list(`/sleep-log/${authId}/`).push(newSleepLog).catch((err: firebase.FirebaseError) => console.error(`Error saving sleep log: ${err.message}`));
          }
          this._db.object(`/sleep/${authId}/${CURRENT_DAY}`).set(sleep).then(() => {
            resolve();
          }).catch((err: firebase.FirebaseError) => reject(err));
        })
        .catch((err: Error) => console.error(`Error storing life points: ${err.toString()}`));
    });
  }

  public saveSleepGoals(authId: string, goals: SleepGoals): firebase.Promise<void> {
    return this._db.object(`/sleep/${authId}/goals`).set(goals);
  }
}
