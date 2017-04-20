// App
import { Injectable } from '@angular/core';
import { User } from '@ionic/cloud-angular';

// Third-party
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as _ from 'lodash';

// Models
import { ConstitutionQuizQuestion, ConstitutionQuizCharacterstic, Dosha, UserProfile } from '../models';

@Injectable()
export class ConstitutionService {
  constructor(
    private _af: AngularFire,
    private _user: User
  ) { }

  /**
   * Calculates the constitution based on the constitution quiz for a a user profile
   * @param {UserProfile} profile The profile to set the constitution to
   * @param {Array} questions The answered constitution quiz questions
   * @returns {void}
   */
  private _setConstitution(profile: UserProfile, questions: Array<ConstitutionQuizQuestion>): void {
    let kaphaPoints: number = 0,
      pittaPoints: number = 0,
      vataPoints: number = 0;

    questions.forEach((question: ConstitutionQuizQuestion) => question.characteristics.forEach((characteristic: ConstitutionQuizCharacterstic) => {
      if (characteristic.checked) {
        switch (characteristic.dosha) {
          case 'kapha':
            kaphaPoints++;
            break;

          case 'pitta':
            pittaPoints++;
            break;

          case 'vata':
            vataPoints++;
            break;

          default:
            break;
        }
      }
    }));

    kaphaPoints = kaphaPoints * 100 / questions.length;
    pittaPoints = pittaPoints * 100 / questions.length;
    vataPoints = vataPoints * 100 / questions.length;

    let constitutionPoints: Array<{ name: string, value: number }> = _.sortBy([
      {
        name: 'Kapha',
        value: kaphaPoints
      },
      {
        name: 'Pitta',
        value: pittaPoints
      },
      {
        name: 'Vata',
        value: vataPoints
      }
    ], item => item.value);

    profile.constitution = {
      kapha: kaphaPoints,
      pitta: pittaPoints,
      vata: vataPoints
    };

    if (constitutionPoints[2].value - constitutionPoints[1].value <= 20 && constitutionPoints[2].value - constitutionPoints[0].value <= 20) {
      profile.dosha = 'tridosha'
    } else if (constitutionPoints[2].value - constitutionPoints[1].value <= 20) {
      profile.dosha = `${constitutionPoints[2].name}-${constitutionPoints[1].name}`
    } else {
      profile.dosha = constitutionPoints[2].name;
    }
  }

  public getConstitutionQuestions(): FirebaseListObservable<Array<ConstitutionQuizQuestion>> {
    return this._af.database.list('/constitution-quiz');;
  }

  public getDoshaDetails(dosha: string): FirebaseObjectObservable<Dosha> {
    return this._af.database.object(`/doshas/${dosha.toLocaleLowerCase()}`);
  }

  public saveConstitution(questions: Array<ConstitutionQuizQuestion>): Promise<void> {
    let profile: UserProfile = new UserProfile();

    this._setConstitution(profile, questions);
    
    console.log(profile);

    this._user.set('profile', profile);
    return this._user.save();
  }

}
