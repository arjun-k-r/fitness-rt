// Angular
import { Injectable } from '@angular/core';

// Rxjs
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

// Firebase
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Fitness, LifePoints } from '../../models';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class FitnessProvider {
  constructor(
    private _db: AngularFireDatabase
  ) { }

  private _calculateTHRMax(hrMax: number = 0, hrRest: number = 0): number {
    return Math.round(0.85 * (hrMax - hrRest) + hrRest);
  }

  private _calculateTHRMin(hrMax: number = 0, hrRest: number = 0): number {
    return Math.round(0.5 * (hrMax - hrRest) + hrRest);
  }

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

  /**
   * The U.S. Navy body fat equations developed by Drs. Hodgdon and Beckett at the Naval Health Research Center
   */
  public calculateBodyFat(age: number, gender: string, height: number, hips: number, neck: number, waist: number): number {
    if (gender === 'male') {
      return +(495 / (1.0324 - 0.19077 * Math.log10(Math.abs(+waist - +neck)) + 0.15456 * Math.log10(+height)) - 450).toFixed(2);
    } else {
      return +(495 / (1.29579 - 0.35004 * Math.log10(Math.abs(+waist + +hips - +neck)) + 0.221 * Math.log10(+height)) - 450).toFixed(2);
    }
  }

  /**
   * Nes, B.M, et al. HRMax formula
   */
  public calculateHRMax(age: number): number {
    return Math.round(211 - (0.64 * +age));
  }

  /**
  * Calculates the heart tThe Karvonen method
  */
  public calculateTHR(hrMax: number, hrRest: number): { min: number, max: number } {
    return {
      min: this._calculateTHRMin(+hrMax, +hrRest),
      max: this._calculateTHRMax(+hrMax, +hrRest)
    };
  }

  public checkFatPercentage(fatPercentage: number, gender: string): boolean {
    if (gender === 'male') {
      return fatPercentage <= 17;
    } else {
      return fatPercentage <= 24;
    }
  }

  public getFitness$(authId: string): FirebaseObjectObservable<Fitness> {
    return this._db.object(`/fitness/${authId}`);
  }

  public getLifePoints(authId: string): Promise<LifePoints> {
    return new Promise((resolve, reject) => {
      const subscription: Subscription = Observable.combineLatest(
        this._db.object(`/lifepoints/${authId}/${CURRENT_DAY}/sleep`),
        this._db.object(`/lifepoints/${authId}/${CURRENT_DAY}/nutrition`),
        this._db.object(`/lifepoints/${authId}/${CURRENT_DAY}/exercise`),
        this._db.object(`/lifepoints/${authId}/total`)
      ).subscribe(([sleepPoints, nutritionPoints, exercisePoints, totalLifePoints]: [number, number, number, LifePoints]) => {
        sleepPoints = sleepPoints['$value'] === null ? 0 : sleepPoints['$value'];
        nutritionPoints = nutritionPoints['$value'] === null ? 0 : nutritionPoints['$value'];
        exercisePoints = exercisePoints['$value'] === null ? 0 : exercisePoints['$value'];
        totalLifePoints = totalLifePoints['$value'] === null ? new LifePoints() : totalLifePoints;
        subscription.unsubscribe();
        resolve(new LifePoints(
          exercisePoints,
          nutritionPoints,
          sleepPoints,
          CURRENT_DAY,
          totalLifePoints.timestamp === CURRENT_DAY ? totalLifePoints.totalPoints || 0 : (totalLifePoints.totalPoints + totalLifePoints.sleep + totalLifePoints.nutrition + totalLifePoints.exercise) || 0
        ));
      }, (err: firebase.FirebaseError) => reject(err));
    });
  }

  public getUserWeight$(authId: string): FirebaseObjectObservable<number> {
    return this._db.object(`/fitness/${authId}/weight`);
  }

  public saveFitness(authId: string, fitness: Fitness): Promise<void> {
    return this._db.object(`/fitness/${authId}`).set(fitness);
  }

  public saveLifePoints(authId: string, lifepoints: LifePoints): Promise<void> {
    return this._db.object(`/lifepoints/${authId}/total`).set(lifepoints);
  }
}
