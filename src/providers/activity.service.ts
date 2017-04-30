import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { User } from '@ionic/cloud-angular';

// Third-party
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as moment from 'moment';
import * as _ from 'lodash';

// Models
import { Activity, ActivityPlan } from '../models';

// Providers
import { FitnessService } from './fitness.service';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class ActivityService {
  private _activities: FirebaseListObservable<Array<Activity>>;
  private _activitySubject: Subject<string>;
  private _currentActivityPlan: FirebaseObjectObservable<ActivityPlan>;
  constructor(
    private _af: AngularFire,
    private _fitSvc: FitnessService,
     private _user: User
  ) {
    this._activities = _af.database.list('/activities', {
      query: {
        orderByChild: 'name',
        equalTo: this._activitySubject
      }
    });

    this._currentActivityPlan = _af.database.object(`/activity-plans/${_user.id}/${CURRENT_DAY}`);
  }

  public filterActivities(name: string): void {
    this._activitySubject.next(name);
  }

  public getActivities(): FirebaseListObservable<Array<Activity>> {
    return this._activities;
  }

}
