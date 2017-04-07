// App
import { Injectable } from '@angular/core';

// Firebase
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

// Models
import { IConstitution, IConstitutionQuiz } from '../models';

@Injectable()
export class ConstitutionService {
  private _constitutions: FirebaseObjectObservable<IConstitution>;
  private _quizPoints: IConstitutionQuiz;
  constructor(private _af: AngularFire, ) {
    this._constitutions = _af.database.object('/constitutions');
    this._quizPoints = {
      kapha: {
        physical: Array(20),
        psychological: Array(20)
      },
      pitta: {
        physical: Array(20),
        psychological: Array(20)
      },
      vata: {
        physical: Array(20),
        psychological: Array(20)
      },
    }
  }

  public addPoints(selection: string, dosha: string, type: string, idx: number): void {
    switch (selection) {
      case 'Not at all':
        this._quizPoints[dosha][type][idx] = 0;
        break;

      case 'Sometimes':
        this._quizPoints[dosha][type][idx] = 1;
        break;

      case 'All the time':
        this._quizPoints[dosha][type][idx] = 2;
        break;

      default:
        break;
    }

    console.log(this._quizPoints);
  }

  public getConstitutions(): FirebaseObjectObservable<IConstitution> {
    return this._constitutions;
  }

}
