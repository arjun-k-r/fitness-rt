// App
import { Injectable } from '@angular/core';
import { User } from '@ionic/cloud-angular';

// Firebase
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

// Lodash
import * as _ from 'lodash';

// Models
import { ConstitutionQuiz, ConstitutionScore, IConstitutions, UserProfile } from '../models';

@Injectable()
export class ConstitutionService {
  private _constitutions: FirebaseObjectObservable<IConstitutions>;
  private _quizPoints: ConstitutionQuiz;
  constructor(
    private _af: AngularFire,
    private _user: User
  ) {
    this._constitutions = _af.database.object('/constitutions');
    this._constitutions.subscribe((constitutions: IConstitutions) => {
      this._quizPoints = new ConstitutionQuiz(
        new ConstitutionScore(
          _.fill(Array(constitutions.kapha.physical.length), 0),
          _.fill(Array(constitutions.kapha.psychological.length), 0)
        ),
        new ConstitutionScore(
          _.fill(Array(constitutions.pitta.physical.length), 0),
          _.fill(Array(constitutions.pitta.psychological.length), 0)
        ),
        new ConstitutionScore(
          _.fill(Array(constitutions.vata.physical.length), 0),
          _.fill(Array(constitutions.vata.psychological.length), 0)
        )
      );
    });
  }

  public addPoints(selection: string, dosha: string, type: string, idx: number): void {
    switch (selection) {
      case 'Not at all':
        this._quizPoints[dosha][type][idx] = 0;
        break;

      case 'A little bit':
        this._quizPoints[dosha][type][idx] = 1;
        break;

      case 'Yes and no':
        this._quizPoints[dosha][type][idx] = 2;
        break;

      case 'Not completely':
        this._quizPoints[dosha][type][idx] = 3;
        break;

      case 'Completely':
        this._quizPoints[dosha][type][idx] = 4;
        break;

      default:
        break;
    }

    console.log(this._quizPoints);
  }

  public getConstitutions(): FirebaseObjectObservable<IConstitutions> {
    return this._constitutions;
  }

  public savePrakruti(): Promise<void> {
    let totalPoints: number = 0,
      profile: UserProfile = new UserProfile();

    for (let dosha in this._quizPoints) {
      totalPoints += 4 * (this._quizPoints[dosha].physical.length + this._quizPoints[dosha].psychological.length);
    };

    // Get total points for kapha dosha
    let kaphaPoints: number = this._quizPoints.kapha.physical.reduce((prev: number, curr: number) => prev + curr) + this._quizPoints.kapha.psychological.reduce((prev: number, curr: number) => prev + curr),

      // Get total points for pitta dosha
      pittaPoints: number = this._quizPoints.pitta.physical.reduce((prev: number, curr: number) => prev + curr) + this._quizPoints.kapha.psychological.reduce((prev: number, curr: number) => prev + curr),

      // Get total points for vata dosha
      vataPoints: number = this._quizPoints.vata.physical.reduce((prev: number, curr: number) => prev + curr) + this._quizPoints.kapha.psychological.reduce((prev: number, curr: number) => prev + curr);

    profile.prakruti.kapha = Math.floor(kaphaPoints * 100 / (totalPoints || 1));
    profile.prakruti.pitta = Math.floor(pittaPoints * 100 / (totalPoints || 1));
    profile.prakruti.vata = Math.floor(vataPoints * 100 / (totalPoints || 1));

    console.log(profile);

    this._user.set('profile', profile);
    return this._user.save();

  }

}
