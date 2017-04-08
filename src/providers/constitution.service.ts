// App
import { Injectable } from '@angular/core';

// Firebase
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

// Lodash
import * as _ from 'lodash';

// Models
import { ConstitutionQuiz, ConstitutionScore, IConstitutions } from '../models';

@Injectable()
export class ConstitutionService {
  private _constitutions: FirebaseObjectObservable<IConstitutions>;
  private _quizPoints: ConstitutionQuiz;
  constructor(private _af: AngularFire, ) {
    this._constitutions = _af.database.object('/constitutions');
    this._constitutions.subscribe((constitutions: IConstitutions) => {
      this._quizPoints = new ConstitutionQuiz(
        new ConstitutionScore(
          Array(constitutions.kapha.physical.length),
          Array(constitutions.kapha.psychological.length)
        ),
        new ConstitutionScore(
          Array(constitutions.pitta.physical.length),
          Array(constitutions.pitta.psychological.length)
        ),
        new ConstitutionScore(
          Array(constitutions.vata.physical.length),
          Array(constitutions.vata.psychological.length)
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

      case 'Completely':
        this._quizPoints[dosha][type][idx] = 2;
        break;

      default:
        break;
    }

    console.log(this._quizPoints);
  }

  public getConstitutions(): FirebaseObjectObservable<IConstitutions> {
    return this._constitutions;
  }

  public getPrakruti(): string {
    let totalPoints: number = 0;

    for (let dosha in this._quizPoints) {
      /**
       * Remove null values and get total possible points
       */
      _.compact([this._quizPoints[dosha].physical]);
      _.compact([this._quizPoints[dosha].psychological]);
      totalPoints += 2 * (this._quizPoints[dosha].physical.length + this._quizPoints[dosha].psychological.length);
    };

    // Get total points for kapha dosha
    let kaphaPoints: number = this._quizPoints.kapha.physical.reduce((prev: number, curr: number) => prev + curr) + this._quizPoints.kapha.psychological.reduce((prev: number, curr: number) => prev + curr),

      // Get total points for pitta dosha
      pittaPoints: number = this._quizPoints.pitta.physical.reduce((prev: number, curr: number) => prev + curr) + this._quizPoints.kapha.psychological.reduce((prev: number, curr: number) => prev + curr),

      // Get total points for vata dosha
      vataPoints: number = this._quizPoints.vata.physical.reduce((prev: number, curr: number) => prev + curr) + this._quizPoints.kapha.psychological.reduce((prev: number, curr: number) => prev + curr),

      // Save points as percentages and sort them
      doshaPints: Array<{ name: string, value: number }> = _.sortBy([
        {
          name: 'Kapha',
          value: Math.floor(kaphaPoints * 100 / totalPoints)
        },
        {
          name: 'Pitta',
          value: Math.floor(pittaPoints * 100 / totalPoints)
        },
        {
          name: 'Vata',
          value: Math.floor(vataPoints * 100 / totalPoints)
        }
      ], item => item.value);

    // Return the most dominant dosha/doshas
    if (doshaPints[2].value - doshaPints[1].value < 15 && doshaPints[1].value - doshaPints[0].value < 15) {
      return 'tridosha'
    } else if (doshaPints[2].value - doshaPints[1].value < 15) {
      return `${doshaPints[2].name}-${doshaPints[1].name}`
    } else {
      return doshaPints[2].name;
    }

  }

}
