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
import { IEmotion, MindBalance } from '../../models';

const CURRENT_DAY: string = moment().format('YYYY-MM-DD');
@Injectable()
export class MindBalanceProvider {
  private trendDaysSubject: Subject<any> = new Subject();
  constructor(
    private db: AngularFireDatabase
  ) { }

  public changeTrendDays(days: number): void {
    this.trendDaysSubject.next(days);
  }

  public getEmotions$(): FirebaseListObservable<IEmotion[]> {
    return this.db.list('emotions', {
      query: {
        orderByChild: name
      }
    });
  }

  public getMindBalance$(authId: string, date?: string): FirebaseObjectObservable<MindBalance> {
    return this.db.object(`/${authId}/mind-balance/${date || CURRENT_DAY}`);
  }

  public getTrends$(authId: string, days?: number): FirebaseListObservable<MindBalance[]> {
    setTimeout(() => {
      this.changeTrendDays(days);
    });
    return this.db.list(`/${authId}/trends/mind-balance/`, {
      query: {
        limitToLast: this.trendDaysSubject
      }
    });
  }

  public saveMindBalance(authId: string, mindBalance: MindBalance, trends: MindBalance[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      const trend: MindBalance = trends.find((mb: MindBalance) => mb.date === mindBalance.date);
      if (trend) {
        this.db.list(`/${authId}/trends/mind-balance/`).update(trend['$key'], mindBalance);
      } else {
        this.db.list(`/${authId}/trends/mind-balance/`).push(mindBalance);
      }
      this.db.object(`/${authId}/mind-balance/${mindBalance.date}`).set(mindBalance).then(() => {
        resolve();
      }).catch((err: FirebaseError) => reject(err));
    });
  }

}
