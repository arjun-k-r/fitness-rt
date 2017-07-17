// App
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Storage } from '@ionic/storage';

// Third-party
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import * as moment from 'moment';

// Models
import { Fitness } from '../../models';

export const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class FitnessService {
  private _fitness$: FirebaseObjectObservable<Fitness>;
  constructor(
    private _afAuth: AngularFireAuth,
    private _db: AngularFireDatabase,
    private _storage: Storage
  ) { }

  private _calculateTHRMax(hrMax: number, hrRest: number): number {
    return Math.round(0.85 * (hrMax - hrRest) + hrRest);
  }

  private _calculateTHRMin(hrMax: number, hrRest: number): number {
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

  public getBodyFatFlag(fatPercentage: number, gender: string): boolean {
    if (gender === 'male') {
      return fatPercentage <= 17;
    } else {
      return fatPercentage <= 24;
    }
  }

  public getFitness$(): Observable<Fitness> {
    return new Observable((observer: Observer<Fitness>) => {
      this._afAuth.authState.subscribe((auth: firebase.User) => {
        if (!!auth) {
          this._fitness$ = this._db.object(`/fitness/${auth.uid}`);
          this._fitness$.subscribe((fitness: Fitness) => {
            if (fitness['$value'] === null) {
              this._fitness$.set(new Fitness());
            } else {
              observer.next(fitness);
            }
          }, (err: firebase.FirebaseError) => observer.error(err));
        }
      }, (err: firebase.FirebaseError) => observer.error(err));
    });
  }

  public saveFitness(fitness: Fitness): void {
    this._storage.ready().then((storage: LocalForage) => {
      this._storage.set(`userRequirements${CURRENT_DAY}`, fitness.requirements)
        .then(() => {
          this._storage.set('userWeight', fitness.weight)
            .then(() => this._fitness$.update(fitness))
            .catch((err: Error) => console.error(err));
        })
        .catch((err: Error) => console.error(err));
    });
  }
}
