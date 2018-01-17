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
    return this._db.object(`/user-profiles/${authId}`);
  }

  public getTrends$(authId: string, days: number): FirebaseListObservable<FitnessTrend[]> {
    return this._db.list(`/trends/fitness/${authId}/`, {
      query: {
        limitToLast: days || 7
      }
    });
  }

  public saveUserProfile(authId: string, trends: FitnessTrend[], user: UserProfile): Promise<void> {
    const { measurements } = user;
    const newTrend: FitnessTrend = new FitnessTrend(user.fitness.bodyFatPercentage.fatPercentage, measurements.chest, moment().format('DD-MM-YYYY'), measurements.height, measurements.hips, measurements.neck, measurements.waist, measurements.weight);
    if (!!trends.length) {
      trends.reverse();
      if (newTrend.date !== trends[0].date) {
        this._db.list(`/trends/fitness/${authId}/`).push(newTrend);
      } else {
        this._db.list(`/trends/fitness/${authId}/`).update(trends[0]['$key'], newTrend).catch((err: firebase.FirebaseError) => console.error(`Error saving sleep log: ${err.message}`));
      }
    } else {
      this._db.list(`/trends/fitness/${authId}/`).push(newTrend);
    }
    return this._db.object(`/user-profiles/${authId}`).set(user);
  }

}
