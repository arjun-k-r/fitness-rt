// Angular
import { Injectable } from '@angular/core';

// Firebase
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';

// Models
import { User } from '../../models';

@Injectable()
export class UserProfileProvider {
  constructor(
    private _db: AngularFireDatabase
  ) { }

  public getUser$(authId: string): FirebaseObjectObservable<User> {
    return this._db.object(`/users/${authId}`);
  }

  public saveUser(authId: string, user: User): Promise<void> {
    return this._db.object(`/users/${authId}`).set(user);
  }

}
