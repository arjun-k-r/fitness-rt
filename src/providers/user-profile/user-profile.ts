// Angular
import { Injectable } from '@angular/core';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { FitnessTrend, UserProfile } from '../../models';

@Injectable()
export class UserProfileProvider {
  constructor(
    private _db: AngularFireDatabase
  ) { }

  public getUserProfile$(authId: string): FirebaseObjectObservable<UserProfile> {
    return this._db.object(`/${authId}/profile/`);
  }

  public getTrends$(authId: string, days: number): FirebaseListObservable<FitnessTrend[]> {
    return this._db.list(`/${authId}/trends/fitness/`, {
      query: {
        limitToLast: days || 7
      }
    });
  }

  public saveUserProfile(authId: string, trends: FitnessTrend[], user: UserProfile): Promise<{}> {
    return new Promise((resolve, reject) => {
      const { measurements } = user;
      const newTrend: FitnessTrend = new FitnessTrend(user.fitness.bodyFatPercentage.fatPercentage, measurements.chest, moment().format('YYYY-MM-DD'), measurements.height, measurements.hips, measurements.neck, measurements.waist, measurements.weight);
      if (!!trends.length) {
        trends.reverse();
        if (newTrend.date !== trends[0].date) {
          this._db.list(`/${authId}/trends/fitness/`).push(newTrend);
        } else {
          this._db.list(`${authId}/trends/fitness/`).update(trends[0]['$key'], newTrend);
        }
      } else {
        this._db.list(`/${authId}/trends/fitness/`).push(newTrend)
      }
      this._db.object(`/${authId}/profile/`).set(user).then(() => {
        resolve();
      }).catch((err: firebase.FirebaseError) => reject(err));
    });
  }

}
