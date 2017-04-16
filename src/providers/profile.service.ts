// App
import { Injectable } from '@angular/core';
import { User } from '@ionic/cloud-angular';

// Firebase
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

// Models
import { ActivitySchedule, UserProfile } from '../models';

@Injectable()
export class ProfileService {
  private _profile: FirebaseObjectObservable<UserProfile>;
  constructor(private _af: AngularFire, private _user: User) {
    this._profile = _af.database.object(`/profiles/${_user.id}`);
  }

  public getProfile(): UserProfile {
    return <UserProfile>this._user.get('profile', new UserProfile());
  }

  public saveProfile(profile: UserProfile): void {
    profile.activitySchedule = new ActivitySchedule();
    this._user.set('profile', profile);
    this._user.save();
    this._profile.set(profile);
  }

}
