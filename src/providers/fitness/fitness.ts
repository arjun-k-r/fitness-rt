// Angular
import { Injectable } from '@angular/core';

// Firebase
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';

// Models
import { Fitness } from '../../models';

@Injectable()
export class FitnessProvider {
  constructor(
    private _db: AngularFireDatabase
  ) { }

  /**
   * The Revised Harris-Benedict Equation
   */
  public calculateBmr(age: number, gender: string, height: number, weight: number): number {
    if (gender === 'male') {
      return Math.round(13.397 * +weight + 4.799 * +height - 5.677 * +age + 88.362);
    } else {
      return Math.round(9.247 * +weight + 3.098 * +height - 4.33 * +age + 447.593);
    }
  }

  public getFitness$(authId: string): FirebaseObjectObservable<Fitness> {
    return this._db.object(`/fitness/${authId}`);
  }

  public getUserWeight$(authId: string): FirebaseObjectObservable<number> {
    return this._db.object(`/fitness/${authId}/weight`);
  }

  public saveFitness(authId: string, fitness: Fitness): Promise<void> {
    return this._db.object(`/fitness/${authId}`).set(fitness);
  }
}
