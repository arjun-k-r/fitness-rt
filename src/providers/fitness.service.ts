// App
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from '@ionic/cloud-angular';

// Third-party
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import * as moment from 'moment';

// Models
import { Nutrition, Fitness } from '../models';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class FitnessService {
  private _fitness: FirebaseObjectObservable<Fitness>;
  constructor(private _db: AngularFireDatabase, private _storage: Storage, private _user: User) {
    this._fitness = _db.object(`/fitnesss/${_user.id}`);
  }

  private _getHeartRateTrainingMax(hrMax: number, hrRest: number): number {
    return Math.round(0.85 * (hrMax - hrRest) + hrRest);
  }

  private _getHeartRateTrainingMin(hrMax: number, hrRest: number): number {
    return Math.round(0.5 * (hrMax - hrRest) + hrRest);
  }

  /**
   * The Revised Harris-Benedict Equation
   */
  public getBmr(age: number, gender: string, height: number, weight: number): number {
    if (gender === 'male') {
      return Math.round(13.397 * weight + 4.799 * height - 5.677 * age + 88.362);
    } else {
      return Math.round(9.247 * weight + 3.098 * height - 4.33 * age + 447.593);
    }
  }

  /**
   * The U.S. Navy body fat equations developed by Drs. Hodgdon and Beckett at the Naval Health Research Center
   */
  public getBodyFat(age: number, gender: string, height: number, hips: number, neck: number, waist: number): number {
    if (gender === 'male') {
      return +(495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450).toFixed(2);
    } else {
      return +(495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.221 * Math.log10(height)) - 450).toFixed(2);
    }
  }

 /**
  * Nes, B.M, et al. HRMax formula
  */
  public getHeartRateMax(age: number): number {
    return Math.round(211 - (0.64 * age));
  }

  /**
  * The Karvonen method
  */
  public getHeartRateTrainingRange(hrMax: number, hrRest: number): { min: number, max: number } {
    return {
      min: this._getHeartRateTrainingMin(+hrMax, +hrRest),
      max: this._getHeartRateTrainingMax(+hrMax, +hrRest)
    };
  }

  public getIdealBodyFat(gender: string): number {
    return gender === 'male' ? 12 : 21;
  }

  public getIdealWeight(gender: string, height: number, weight: number): number {
    let extraInch: number = (height * 0.394) % 12;
    return gender === 'male' ? Math.round(52 + 1.9 * extraInch) : Math.round(49 + 1.7 * extraInch);
  }

  public getImbalanceSymptoms$(imbalanceKey: string, imbalanceType: string): FirebaseObjectObservable<Array<string>> {
    return this._db.object(`/imbalance/${imbalanceType}/${imbalanceKey}`);
  }

  public getFitness(): Fitness {
    return <Fitness>this._user.get('fitness', new Fitness());
  }

  public getUserRequirements(): Nutrition {
    return <Nutrition>this.getFitness().requirements;
  }

  public getUserWeight(): number {
    return <number>this.getFitness().weight;
  }

  public restoreEnergyConsumption(): Promise<number> {
    return new Promise(resolve => {
      this._storage.ready().then(() => this._storage.get('energyConsumption').then((energy: { date: number, consumption: number }) => {
        if (!!energy && energy.date === CURRENT_DAY) {
          console.log('Restoring energy consumption...', energy);
          resolve(energy.consumption);
        } else {
          resolve(0);
        }
      }));
    });
  }

  public restoreEnergyIntake(): Promise<number> {
    return new Promise(resolve => {
      this._storage.ready().then(() => this._storage.get('energyIntake').then((energy: { date: number, intake: number }) => {
        if (!!energy && energy.date === CURRENT_DAY) {
          console.log('Restoring energy intake...', energy);
          resolve(energy.intake);
        } else {
          resolve(0);
        }
      }));
    });
  }

  public saveFitness(fitness: Fitness): void {
    console.log('Saving fitness: ', fitness);

    this._user.set('fitness', fitness);
    this._user.save();
    this._fitness.set(fitness);
  }

  public storeEnergyConsumption(energyConsumption: number): void {
    console.log('Storing energy consumption: ', energyConsumption);
    this._storage.ready().then(() => this._storage.set('energyConsumption', { date: CURRENT_DAY, consumption: energyConsumption }));
  }

  public storeEnergyIntake(energyIntake: number): void {
    console.log('Storing energy intake: ', energyIntake);
    this._storage.ready().then(() => this._storage.set('energyIntake', { date: CURRENT_DAY, intake: energyIntake }));
  }

}
