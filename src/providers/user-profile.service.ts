// App
import { Injectable } from '@angular/core';
import { Auth } from '@ionic/cloud-angular';

// Firebase
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

// Models
import { UserProfile } from '../models';

@Injectable()
export class UserProfileService {
  private _profile: FirebaseObjectObservable<UserProfile>;
  constructor(private _af: AngularFire, private _auth: Auth) {
    this._profile = _af.database.object(`/user-profiles`);
  }

}
