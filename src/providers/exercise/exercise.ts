
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
  private activities$: FirebaseListObservable<ActivityCategory[]>;
  private muscleGroupExercises$: FirebaseListObservable<IMuscleGroup[]>;
  private trendDaysSubject: Subject<any> = new Subject();
  constructor(
    private db: AngularFireDatabase
  ) {
    this.activities$ = this.db.list('/activities', {
      query: {
        orderByChild: 'name'
      }
    });
    this.muscleGroupExercises$ = this.db.list('/muscle-group-exercises', {
      query: {
        orderByChild: 'name'
      }
    });
  }

  public calculateActivityEnergyBurn(activity: Activity, weight: number): number {
    return Math.round(activity.met * weight * activity.duration / 60);
  }

  public changeTrendDays(days: number): void {
    this.trendDaysSubject.next(days);
  }

  public getActivities$(): FirebaseListObservable<ActivityCategory[]> {
    return this.activities$;
  }

  public getExercise$(authId: string, date?: string): FirebaseObjectObservable<Exercise> {
    return this.db.object(`/${authId}/exercise/${date || CURRENT_DAY}`);
  }

  public getMuscleGroupExercises$(): FirebaseListObservable<IMuscleGroup[]> {
    return this.muscleGroupExercises$;
  }

  public getTrends$(authId: string, days?: number): FirebaseListObservable<Exercise[]> {
    setTimeout(() => {
      this.changeTrendDays(days);
    });
    return this.db.list(`/${authId}/trends/exercise/`, {
      query: {
        limitToLast: this.trendDaysSubject
      }
    });
  }

  public saveExercise(authId: string, exercise: Exercise, trends: Exercise[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      const trend: Exercise = trends.find((e: Exercise) => e.date === exercise.date);
      if (trend) {
        this.db.list(`/${authId}/trends/exercise/`).update(trend['$key'], exercise);
      } else {
        this.db.list(`/${authId}/trends/exercise/`).push(exercise);
      }
      this.db.object(`/${authId}/exercise/${exercise.date}`).set(exercise).then(() => {
        resolve();
      }).catch((err: FirebaseError) => reject(err));
    });
  }

}
