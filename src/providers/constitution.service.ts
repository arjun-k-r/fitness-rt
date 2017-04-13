// App
import { Injectable } from '@angular/core';
import { User } from '@ionic/cloud-angular';

// Firebase
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

// Lodash
import * as _ from 'lodash';

// Models
import { ConstitutionScore, ConstitutionQuiz, DoshaQuizQuestion, DoshaScore, UserProfile } from '../models';

// Providers
import { AyurvedicService } from './ayurvedic.service';

@Injectable()
export class ConstitutionService {
  private _quizPoints: ConstitutionScore;
  constructor(
    private _af: AngularFire,
    private _ayurvedicSvc: AyurvedicService,
    private _user: User
  ) {
    _af.database.object('/constitutions').subscribe((constitutions: ConstitutionQuiz) => {
      this._quizPoints = new ConstitutionScore(
        new DoshaScore(
          _.fill(Array(constitutions.kapha.physical.length), 0),
          _.fill(Array(constitutions.kapha.psychological.length), 0)
        ),
        new DoshaScore(
          _.fill(Array(constitutions.pitta.physical.length), 0),
          _.fill(Array(constitutions.pitta.psychological.length), 0)
        ),
        new DoshaScore(
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

  public getConstitutionQuiz(): Promise<ConstitutionQuiz> {
    return new Promise(resolve => {
      let constitutionQuiz: ConstitutionQuiz = new ConstitutionQuiz();
      this._af.database.object('/constitutions').subscribe((quiz: ConstitutionQuiz) => {
        for (let dosha in quiz) {
          quiz[dosha].physical.forEach((question: string) => constitutionQuiz[dosha].physical.push(new DoshaQuizQuestion(question, '')));
          quiz[dosha].psychological.forEach((question: string) => constitutionQuiz[dosha].psychological.push(new DoshaQuizQuestion(question, '')));
        }
        resolve(constitutionQuiz);
      });
    });
  }

  public getQuizProgress(): FirebaseObjectObservable<ConstitutionQuiz> {
    return this._af.database.object(`/quiz/${this._user.id}`);
  }

  public savePrakruti(): Promise<void> {
    let profile: UserProfile = new UserProfile();

    // Get total points for kapha dosha
    let kaphaPoints: number = this._quizPoints.kapha.physical.reduce((prev: number, curr: number) => prev + curr) +     this._quizPoints.kapha.psychological.reduce((prev: number, curr: number) => prev + curr),

      // Get total points for pitta dosha
      pittaPoints: number = this._quizPoints.pitta.physical.reduce((prev: number, curr: number) => prev + curr) + this._quizPoints.kapha.psychological.reduce((prev: number, curr: number) => prev + curr),

      // Get total points for vata dosha
      vataPoints: number = this._quizPoints.vata.physical.reduce((prev: number, curr: number) => prev + curr) + this._quizPoints.kapha.psychological.reduce((prev: number, curr: number) => prev + curr),

      // Total cumulated points
      totalPoints: number = kaphaPoints + pittaPoints + vataPoints;

    profile.prakruti.kapha = +(kaphaPoints * 100 / totalPoints).toFixed(2);
    profile.prakruti.pitta = +(pittaPoints * 100 / totalPoints).toFixed(2);
    profile.prakruti.vata = +(vataPoints * 100 / totalPoints).toFixed(2);
    profile.constitution = this._ayurvedicSvc.getConstitution(profile.prakruti);

    console.log(profile);

    this._user.set('profile', profile);
    return this._user.save();
  }

  public saveQuizProgress(quiz: ConstitutionQuiz): void {
    this._af.database.object(`/quiz/${this._user.id}`).set(quiz);
  }

}
