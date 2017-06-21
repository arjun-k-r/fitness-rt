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

  /**
  * Calculates the maximum of heart rate reached during aerobic exercise which enables one's heart and lungs to receive the most benefit from a workout
  * @desc Base on the Karvonen method 
  * @param {number} hrMax - The user's maximum heart rate
  * @param {number} hrRest - The user's resting heart rate
  * @returns {number} Returns the training heart rate max
  */
  private _getHeartRateTrainingMax(hrMax: number, hrRest: number): number {
    return Math.round(0.85 * (hrMax - hrRest) + hrRest);
  }

  /**
  * Calculates the minimum of heart rate reached during aerobic exercise which enables one's heart and lungs to receive the most benefit from a workout
  * @desc Base on the Karvonen method 
  * @param {number} hrMax - The user's maximum heart rate
  * @param {number} hrRest - The user's resting heart rate
  * @returns {number} Returns the training heart rate min
  */
  private _getHeartRateTrainingMin(hrMax: number, hrRest: number): number {
    return Math.round(0.5 * (hrMax - hrRest) + hrRest);
  }

  /**
   * Gets the user's body mass index
   * @description The Revised Harris-Benedict Equation
   * @param {number} age - The user's age
   * @param {string} gender - The user's gender
   * @param {number} height - The user's height in centimeters
   * @param {number} weight - The user's weight in kilograms
   * @returns {number} Returns the body mass index
   */
  public getBmr(age: number, gender: string, height: number, weight: number): number {
    if (gender === 'male') {
      return Math.round(13.397 * weight + 4.799 * height - 5.677 * age + 88.362);
    } else {
      return Math.round(9.247 * weight + 3.098 * height - 4.33 * age + 447.593);
    }
  }

  /**
   * Gets the user's body fat
   * @description The U.S. Navy body fat equations developed by Drs. Hodgdon and Beckett at the Naval Health Research Center
   * @param {number} age - The user's age
   * @param {string} gender - The user's gender
   * @param {number} height - The user's height in centimeters
   * @param {number} hips - The user's hips (women only)
   * @param {number} neck - The user's neck in centimeters
   * @param {number} waist - The user's waist in centimeters
   * @returns {number} Returns the body fat percentage
   */
  public getBodyFat(age: number, gender: string, height: number, hips: number, neck: number, waist: number): number {
    if (gender === 'male') {
      return +(495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450).toFixed(2);
    } else {
      return +(495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.221 * Math.log10(height)) - 450).toFixed(2);
    }
  }

 /**
  * Calculates the maximum cardiac output of a user based on its age
  * @desc Nes, B.M, et al. HRMax formula
  * @param {number} age - The user's age
  * @returns {number} Returns the HRMax
  */
  public getHeartRateMax(age: number): number {
    return Math.round(211 - (0.64 * age));
  }

  /**
  * Calculates the range of heart rate reached during aerobic exercise which enables one's heart and lungs to receive the most benefit from a workout
  * @desc Base on the Karvonen method
  * @param {number} hrMax - The user's maximum heart rate
  * @param {number} hrRest - The user's resting heart rate
  * @returns {{ min: number, max: number }} Returns the training heart rate range
  */
  public getHeartRateTrainingRange(hrMax: number, hrRest: number): { min: number, max: number } {
    return {
      min: this._getHeartRateTrainingMin(+hrMax, +hrRest),
      max: this._getHeartRateTrainingMax(+hrMax, +hrRest)
    };
  }

  /**
   * Gets the ideal body fat by gender
   * @param {string} gender - The user's gender
   * @returns {number} Returns the ideal body fat in percentages
   */
  public getIdealBodyFat(gender: string): number {
    return gender === 'male' ? 12 : 21;
  }

  /**
   * Gets the ideal body weight
   * @param {string} gender - The user's gender
   * @param {number} height - The user's height in centimeters
   * @param {number} weight - The user's weight in kilograms
   * @returns {number} Returns the ideal weight in kilograms
   */
  public getIdealWeight(gender: string, height: number, weight: number): number {
    let extraInch: number = (height * 0.394) % 12;
    return gender === 'male' ? Math.round(52 + 1.9 * extraInch) : Math.round(49 + 1.7 * extraInch);
  }

  /**
   * Gets the signs and symptoms of a specific imbalance
   * @param {string} imbalanceKey - The key of the imbalance factor
   * @param {string} imbalanceType - Type of imbalance (deficiencies or excess)
   * @returns {FirebaseObjectObservable} Returns observable of symptoms
   */
  public getImbalanceSymptoms$(imbalanceKey: string, imbalanceType: string): FirebaseObjectObservable<Array<string>> {
    return this._db.object(`/imbalance/${imbalanceType}/${imbalanceKey}`);
  }

  /**
   * Queries the user's fitness fitness from the database
   * @returns {Fitness} Returns the user's fitness fitness
   */
  public getFitness(): Fitness {
    return <Fitness>this._user.get('fitness', new Fitness());
  }

  /**
   * Gets the user's daily nutritional requirements from temporary storage
   * @returns {Nutrition} Returns the user's daily intakes
   */
  public getUserRequirements(): Nutrition {
    return <Nutrition>this.getFitness().requirements;
  }

  /**
   * Gets the user's weight
   * @returns {number} Returns the user's weight in kilograms
   */
  public getUserWeight(): number {
    return <number>this.getFitness().weight;
  }

  /**
   * Retores the daily energy consumption from local storage
   * @returns {Promise} Returns the user's daily energy consumption
   */
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

  /**
   * Retores the daily energy intake from local storage
   * @returns {Promise} Returns the user's daily energy intake
   */
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

  /**
   * Stores user's fitness fitness to the database
   * @param {Fitness} fitness - The user's fitness fitness
   * @returns {void}
   */
  public saveFitness(fitness: Fitness): void {
    console.log('Saving fitness: ', fitness);

    this._user.set('fitness', fitness);
    this._user.save();
    this._fitness.set(fitness);
  }

  /**
   * Stores the daily energy consumption localy
   * @param {number} energyConsumption - The user's daily energy consumption
   * @returns {void}
   */
  public storeEnergyConsumption(energyConsumption: number): void {
    console.log('Storing energy consumption: ', energyConsumption);
    this._storage.ready().then(() => this._storage.set('energyConsumption', { date: CURRENT_DAY, consumption: energyConsumption }));
  }

  /**
   * Stores the daily energy intake localy
   * @param {number} energyIntake - The user's daily energy intake
   * @returns {void}
   */
  public storeEnergyIntake(energyIntake: number): void {
    console.log('Storing energy intake: ', energyIntake);
    this._storage.ready().then(() => this._storage.set('energyIntake', { date: CURRENT_DAY, intake: energyIntake }));
  }

}
