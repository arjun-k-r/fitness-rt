import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Subject } from 'rxjs/Subject';

// Models
import { Activity } from '../models';

@Injectable()
export class ActivityService {
  private _activities: FirebaseListObservable<Array<Activity>>;
  private _activitySubject: Subject<string>;
  constructor(
    private _af: AngularFire
  ) {
    this._activities = _af.database.list('/activities', {
      query: {
        orderByChild: 'name',
        equalTo: this._activitySubject
      }
    });
  }

  public filterActivities(name: string): void {
    this._activitySubject.next(name);
  }

  public getActivities(): FirebaseListObservable<Array<Activity>> {
    return this._activities;
  }

}
