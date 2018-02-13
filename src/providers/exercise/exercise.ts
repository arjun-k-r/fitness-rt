
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
import { Activity, ActivityCategory, Exercise, IMuscleGroup } from '../../models';

const CURRENT_DAY: string = moment().format('YYYY-MM-DD');

@Injectable()
export class ExerciseProvider {
  private _activities$: FirebaseListObservable<ActivityCategory[]>;
  private _muscleGroupExercises$: FirebaseListObservable<IMuscleGroup[]>;
  private _trendDaysSubject: Subject<any> = new Subject();
  constructor(
    private _db: AngularFireDatabase
  ) {
    this._activities$ = this._db.list('/activities', {
      query: {
        orderByChild: 'name'
      }
    });
    this._muscleGroupExercises$ = this._db.list('/muscle-group-exercises', {
      query: {
        orderByChild: 'name'
      }
    });
  }

  public calculateActivityEnergyBurn(activity: Activity, weight: number): number {
    return Math.round(activity.met * weight * activity.duration / 60);
  }

  public changeTrendDays(days: number): void {
    this._trendDaysSubject.next(days);
  }

  public getActivities$(): FirebaseListObservable<ActivityCategory[]> {
    return this._activities$;
  }

  public getExercise$(authId: string, date?: string): FirebaseObjectObservable<Exercise> {
    return this._db.object(`/${authId}/exercise/${date || CURRENT_DAY}`);
  }

  public getMuscleGroupExercises$(): FirebaseListObservable<IMuscleGroup[]> {
    return this._muscleGroupExercises$;
  }

  public getTrends$(authId: string, days?: number): FirebaseListObservable<Exercise[]> {
    setTimeout(() => {
      this.changeTrendDays(days);
    });
    return this._db.list(`/${authId}/trends/exercise/`, {
      query: {
        limitToLast: this._trendDaysSubject
      }
    });
  }

  public saveExercise(authId: string, exercise: Exercise, trends: Exercise[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      const trend: Exercise = trends.find((e: Exercise) => e.date === exercise.date);
      if (trend) {
        this._db.list(`/${authId}/trends/exercise/`).update(trend['$key'], exercise);
      } else {
        this._db.list(`/${authId}/trends/exercise/`).push(exercise);
      }
      this._db.object(`/${authId}/exercise/${exercise.date}`).set(exercise).then(() => {
        resolve();
      }).catch((err: FirebaseError) => reject(err));
    });
  }

}
