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

  public getBmr(age: number, gender: string, height: number, weight: number): number {
    if (gender === 'male') {
      return Math.floor(13.397 * weight + 4.799 * height - 5.677 * age + 88.362);
    } else {
      return Math.floor(9.247 * weight + 3.098 * height - 4.33 * age + 447.593);
    }
  }

  public saveProfile(profile: UserProfile): void {
    console.log(profile);
    this._user.set('profile', profile);
    this._user.save();
    this._profile.set(profile);
  }

}
