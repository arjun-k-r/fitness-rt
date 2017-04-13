// App
import { Injectable } from '@angular/core';

// Firebase
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

// Models
import { Dosha } from '../models';

@Injectable()
export class AyurvedicService {

  constructor(private _af: AngularFire) {  }

  public getDoshaDetails(dosha: string): FirebaseObjectObservable<Dosha> {
    return this._af.database.object(`/doshas/${dosha.toLocaleLowerCase()}`);
  }
}
