// Angular
import { Injectable } from '@angular/core';

// Firebase
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';

// Models
import { UserProfile } from '../../models';

@Injectable()
export class UserProfileProvider {
  constructor(
    private _db: AngularFireDatabase
  ) { }

  public getUserProfile$(authId: string): FirebaseObjectObservable<UserProfile> {
    return this._db.object(`/user-profiles/${authId}`);
  }

  public saveUserProfile(authId: string, user: UserProfile): Promise<void> {
    return this._db.object(`/user-profiles/${authId}`).set(user);
  }

}
