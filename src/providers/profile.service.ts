// App
import { Injectable } from '@angular/core';
import { User } from '@ionic/cloud-angular';

// Firebase
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

// Models
import { UserProfile } from '../models';

@Injectable()
export class ProfileService {
  private _profile: FirebaseObjectObservable<UserProfile>;
  constructor(private _af: AngularFire, private _user: User) {
    this._profile = _af.database.object(`/profiles/${_user.id}`);
  }

  public saveProfile(profile: UserProfile): void {
    console.log(profile);
    this._user.set('profile', profile);
    this._user.save();
    this._profile.set(profile);
  }

}
