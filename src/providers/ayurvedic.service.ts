// App
import { Injectable } from '@angular/core';

// Firebase
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

// Lodash
import * as _ from 'lodash';

// Models
import { Dosha, Prakruti } from '../models';

@Injectable()
export class AyurvedicService {

  constructor(private _af: AngularFire) { }

  public getDoshaDetails(dosha: string): FirebaseObjectObservable<Dosha> {
    return this._af.database.object(`/doshas/${dosha.toLocaleLowerCase()}`);
  }

  public getConstitution(prakruti: Prakruti): string {
    let doshaPints: Array<{ name: string, value: number }> = _.sortBy([
      {
        name: 'Kapha',
        value: prakruti.kapha
      },
      {
        name: 'Pitta',
        value: prakruti.pitta
      },
      {
        name: 'Vata',
        value: prakruti.vata
      }
    ], item => item.value);

    // Return the most dominant dosha/doshas
    if (doshaPints[2].value - doshaPints[1].value <= 20 && doshaPints[2].value - doshaPints[0].value <= 20) {
      return 'tridosha'
    } else if (doshaPints[2].value - doshaPints[1].value <= 20) {
      return `${doshaPints[2].name}-${doshaPints[1].name}`
    } else {
      return doshaPints[2].name;
    }
  }
}
