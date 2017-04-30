// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Loading, LoadingController, Modal, ModalController, NavController } from 'ionic-angular';

// Models
import { Activity, ActivityPlan } from '../../models';

// Pages
import { ActivitySelectPage } from '../activity-select/activity-select';

// Providers
import { ActivityService } from '../../providers';

@Component({
  selector: 'page-activity-plan',
  templateUrl: 'activity-plan.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityPlanPage {
  public activityPlan: ActivityPlan;
  public activityPlanDetails: string = 'physical';
  constructor(
    private _activitySvc: ActivityService,
    private _detectorRef: ChangeDetectorRef,
    private _loadCtrl: LoadingController,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController
  ) { }

  /**
   * Search for a new activity
   * @returns {void}
   */
  public addNewActivity(): void {
    let activitySelectModal: Modal = this._modalCtrl.create(ActivitySelectPage);
    activitySelectModal.present();
    activitySelectModal.onDidDismiss((activity: Activity) => {
      console.log('Selected: ', activity);
      if (activity.type === 'Physical') {
        this.activityPlan.physicalActivities.push(activity);
      } else if (activity.type === 'Intellectual') {
        this.activityPlan.intellectualActivities.push(activity);
      }
      this._detectorRef.markForCheck();
    });
  }

  public segmentChange(): void {
    this._detectorRef.markForCheck();
  }

  ionViewWillEnter(): void {
    let loader: Loading = this._loadCtrl.create({
      content: 'Loading...',
      spinner: 'crescent'
    });

    loader.present();
    this._activitySvc.getActivityPlan$().subscribe((activityPlan: ActivityPlan) => {
      console.log('Received activity plan: ', activityPlan);
      this.activityPlan = activityPlan;
      loader.dismiss();
      this._detectorRef.markForCheck();
    });
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
