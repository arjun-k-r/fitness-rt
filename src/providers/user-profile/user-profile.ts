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
import { Constitution, FitnessTrend, UserProfile } from '../../models';

@Injectable()
export class UserProfileProvider {
  private trendDaysSubject: Subject<any> = new Subject();
  constructor(
    private db: AngularFireDatabase
  ) { }

  public changeTrendDays(days: number): void {
    this.trendDaysSubject.next(days);
  }

  public getUserProfile$(authId: string): FirebaseObjectObservable<UserProfile> {
    return this.db.object(`/${authId}/profile/`);
  }

  public getTrends$(authId: string, days: number): FirebaseListObservable<FitnessTrend[]> {
    setTimeout(() => {
      this.changeTrendDays(days);
    });
    return this.db.list(`/${authId}/trends/fitness/`, {
      query: {
        limitToLast: this.trendDaysSubject
      }
    });
  }

  public saveConstitution(authId: string, constitution: Constitution): Promise<void> {
    return this.db.object(`/${authId}/profile/constitution`).set(constitution);
  }

  public saveUserProfile(authId: string, trends: FitnessTrend[], user: UserProfile): Promise<{}> {
    return new Promise((resolve, reject) => {
      const { measurements } = user;
      const newTrend: FitnessTrend = new FitnessTrend(user.fitness.bodyFatPercentage.fatPercentage, measurements.chest, moment().format('YYYY-MM-DD'), measurements.height, measurements.hips, measurements.iliac, measurements.restingHeartRate, measurements.waist, measurements.weight);
      if (!!trends.length) {
        trends.reverse();
        if (newTrend.date !== trends[0].date) {
          this.db.list(`/${authId}/trends/fitness/`).push(newTrend);
        } else {
          this.db.list(`${authId}/trends/fitness/`).update(trends[0]['$key'], newTrend);
        }
      } else {
        this.db.list(`/${authId}/trends/fitness/`).push(newTrend)
      }
      this.db.object(`/${authId}/profile/`).set(user).then(() => {
        resolve();
      }).catch((err: FirebaseError) => reject(err));
    });
  }

}
