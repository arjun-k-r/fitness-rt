
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
import { Activity, ActivityCategory, IMuscleGroup, Interval, PhysicalActivityLog, Workout } from '../../models';

const CURRENT_DAY: string = moment().format('YYYY-MM-DD');

@Injectable()
export class PhysicalActivityProvider {
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

  public calculateWorkoutDuration(workout: Workout): number {
    return Math.round(workout.intervals.reduce((acc, curr: Interval) => acc += (curr.duration + curr.rest) * curr.sets, 0) / 60);
  }

  public calculateWorkoutMet(workout: Workout, weight: number): number {
    return workout.energyBurn / (weight * workout.duration / 60);
  }

  public changeTrendDays(days: number): void {
    this.trendDaysSubject.next(days);
  }

  public getActivities$(): FirebaseListObservable<ActivityCategory[]> {
    return this.activities$;
  }

  public getPhysicalActivityLog$(authId: string, date?: string): FirebaseObjectObservable<PhysicalActivityLog> {
    return this.db.object(`/${authId}/physical-activity-log/${date || CURRENT_DAY}`);
  }

  public getMuscleGroupExercises$(): FirebaseListObservable<IMuscleGroup[]> {
    return this.muscleGroupExercises$;
  }

  public getTrends$(authId: string, days?: number): FirebaseListObservable<PhysicalActivityLog[]> {
    setTimeout(() => {
      this.changeTrendDays(days);
    });
    return this.db.list(`/${authId}/trends/physical-activity-log/`, {
      query: {
        limitToLast: this.trendDaysSubject
      }
    });
  }

  public getWorkouts$(authId: string): FirebaseListObservable<Workout[]> {
    return this.db.list(`/${authId}/workouts`);
  }

  public removeWorkout(authId: string, workout: Workout): Promise<void> {
    return this.db.list(`/${authId}/workouts/`).remove(workout['$key']);
  }

  public savePhysicalActivityLog(authId: string, physicalActivityLog: PhysicalActivityLog, trends: PhysicalActivityLog[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      const trend: PhysicalActivityLog = trends.find((e: PhysicalActivityLog) => e.date === physicalActivityLog.date);
      if (trend) {
        this.db.list(`/${authId}/trends/physical-activity-log/`).update(trend['$key'], physicalActivityLog);
      } else {
        this.db.list(`/${authId}/trends/physical-activity-log/`).push(physicalActivityLog);
      }
      this.db.object(`/${authId}/physical-activity-log/${physicalActivityLog.date}`).set(physicalActivityLog).then(() => {
        resolve();
      }).catch((err: FirebaseError) => reject(err));
    });
  }

  public saveWorkout(authId: string, workout: Workout): Promise<{}> {
    return new Promise((resolve, reject) => {
      if ('$key' in workout) {
        this.db.list(`/${authId}/workouts/`).update(workout['$key'], workout).then(() => {
          resolve();
        }).catch((err: FirebaseError) => reject(err));
      } else {
        this.db.list(`/${authId}/workouts/`).push(workout).then(() => {
          resolve();
        });
      }
    })
  }

}
