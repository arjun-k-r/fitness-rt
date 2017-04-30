// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { InfiniteScroll, ViewController } from 'ionic-angular';

// Third-party
import { FirebaseListObservable } from 'angularfire2';

// Models
import { Activity } from '../../models';

// Providers
import { ActivityService } from '../../providers';


@Component({
  selector: 'page-activity-select',
  templateUrl: 'activity-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitySelectPage {
  public activities: FirebaseListObservable<Array<Activity>>;
  public limit: number = 50;
  public searchQuery: string = '';
  public selectedActivity: Activity;
  public selectedActivityName: string;
  constructor(
    private _activitySvc: ActivityService,
    private _detectorRef: ChangeDetectorRef,
    private _viewCtrl: ViewController
  ) { }

  public clearSearch(ev): void {
    this.searchQuery = '';
  }

  public doneSelecting(): void {
    this._viewCtrl.dismiss(this.selectedActivity);
  }

  public loadMore(ev: InfiniteScroll) {
    this.limit += 50;
    setTimeout(() => {
      //this._activitySvc.changeActivityQueryLimit(this.limit);
      ev.complete();
    }, 1000);
  }

  public selectActivity(activity: Activity): void {
    this.selectedActivity = activity;
  }

  ionViewWillEnter(): void {
    this.activities = this._activitySvc.getActivities$();
    //this._activitySvc.changeActivityQueryLimit(this.limit);
    console.log('Entering...');
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
}
