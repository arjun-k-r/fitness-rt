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

}
