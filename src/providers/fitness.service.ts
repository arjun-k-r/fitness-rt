// App
import { Injectable } from '@angular/core';
import { User } from '@ionic/cloud-angular';

// Firebase
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

// Models
import { Nutrition, UserProfile } from '../models';

@Injectable()
export class FitnessService {
  private _energyIntake: number = 0;
  private _profile: FirebaseObjectObservable<UserProfile>;
  constructor(private _af: AngularFire, private _user: User) {
    this._profile = _af.database.object(`/profiles/${_user.id}`);
  }

  /**
   * Gets the user's body mass index
   * @description The U.S. Navy body fat equations developed by Drs. Hodgdon and Beckett at the Naval Health Research Center
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
   * Queries the user's fitness profile from the database
   * @returns {UserProfile} Returns the user's fitness profile
   */
  public getProfile(): UserProfile {
    return <UserProfile>this._user.get('profile', new UserProfile());
  }

  /**
   * Gets the user's daily energy intake
   * @returns {number} Returns the user's daily energy intakes in kilocalories
   */
  public getUserEnergyIntakes(): number {
    return this._energyIntake;
  }

  /**
   * Gets the user's daily nutritional requirements from temporary storage
   * @returns {Nutrition} Returns the user's daily intakes
   */
  public getUserRequirements(): Nutrition {
    return <Nutrition>this.getProfile().requirements;
  }

  /**
   * Gets the user's weight
   * @returns {number} Returns the user's weight in kilograms
   */
  public getUserWeight(): number {
    return <number>this.getProfile().weight;
  }

  /**
   * Temporary stores of user energy intakes
   * @param {number} energyIntake - The user's daily energy intake in kilocalroies
   * @returns {void}
   */
  public saveUserEnergyIntakes(energyIntake: number): void {
    this._energyIntake = energyIntake;
  }

  /**
   * Stores user's fitness profile to the database
   * @param {UserProfile} profile - The user's fitness profile
   * @returns {void}
   */
  public saveProfile(profile: UserProfile): void {
    console.log('Saving profile: ', profile);

    this._user.set('profile', profile);
    this._user.save();
    this._profile.set(profile);
  }

}
