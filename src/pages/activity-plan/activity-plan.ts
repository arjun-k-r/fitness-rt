// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert, AlertController, Loading, LoadingController, Modal, ModalController, NavController } from 'ionic-angular';

// Models
import { Activity, ActivityPlan, WarningMessage } from '../../models';

// Pages
import { ActivitySelectPage } from '../activity-select/activity-select';

// Providers
import { ActivityService, AlertService, FitnessService } from '../../providers';

@Component({
  selector: 'page-activity-plan',
  templateUrl: 'activity-plan.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityPlanPage {
  public activityPlan: ActivityPlan;
  public activityPlanDetails: string = 'physical';
  public leftEnergy: number = 0;
  constructor(
    private _activitySvc: ActivityService,
    private _alertCtrl: AlertController,
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _fitSvc: FitnessService,
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
        this.activityPlan.physicalEffort = this._activitySvc.getActivitiesDuration(this.activityPlan.physicalActivities);
      } else if (activity.type === 'Intellectual') {
        this.activityPlan.intellectualActivities.push(activity);
        this.activityPlan.intellectualEffort = this._activitySvc.getActivitiesDuration(this.activityPlan.intellectualActivities);
      }

      this.activityPlan.totalEnergyBurn = this._activitySvc.getTotalEnergyBurn([...this.activityPlan.intellectualActivities, ...this.activityPlan.physicalActivities]);

      this._activitySvc.updateUserRequirements(this.activityPlan.totalEnergyBurn);
      this._activitySvc.getLeftEnergy().then((energy: number) => this.leftEnergy = energy);

      this._detectorRef.markForCheck();
    });
  }

  public changeDuration(activity: Activity): void {
    let alert: Alert = this._alertCtrl.create({
      title: 'Duration',
      subTitle: 'How long did you perform this activity?',
      inputs: [
        {
          name: 'duration',
          placeholder: 'Minutes',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Done',
          handler: data => {
            activity.duration = +data.duration;
            activity.energyBurn = this._activitySvc.getActivityEnergyBurn(activity);
            if (activity.type === 'Physical') {
              this.activityPlan.physicalEffort = this._activitySvc.getActivitiesDuration(this.activityPlan.physicalActivities);
            } else if (activity.type === 'Intellectual') {
              this.activityPlan.intellectualEffort = this._activitySvc.getActivitiesDuration(this.activityPlan.intellectualActivities);
            }
            this.activityPlan.totalEnergyBurn = this._activitySvc.getTotalEnergyBurn([...this.activityPlan.intellectualActivities, ...this.activityPlan.physicalActivities]);
            this._detectorRef.markForCheck();
          }
        }
      ]
    });
    alert.present();
  }

  public removeActivity(idx: number, type: string): void {
    if (type === 'physical') {
      this.activityPlan.physicalActivities.splice(idx, 1);
    } else {
      this.activityPlan.intellectualActivities.splice(idx, 1);
    }
  }

  /**
   * Saves the activity plan to Database
   * @returns {void}
   */
  public saveActivityPlan(): void {
    this._activitySvc.saveActivityPlan(this.activityPlan).then((isGood: boolean) => {
      this._alertSvc.showAlert('Keep up the good work!', 'A perfectly healthy activity plan!', 'Well done!');
      this._activitySvc.getLeftEnergy().then((energy: number) => {
        this.leftEnergy = energy;
        console.log(energy);
        this._detectorRef.markForCheck();
      });
    }).catch((warnings: Array<WarningMessage>) => {
      this.activityPlan.warnings = [...warnings];
      console.log(this.activityPlan);
      this._alertSvc.showAlert('Please check the warnings', 'Your activity plan seems to be unhealthy', 'Oh oh...');
      this._activitySvc.getLeftEnergy().then((energy: number) => {
        this.leftEnergy = energy;
        console.log(energy);
        this._detectorRef.markForCheck();
      });
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
    this._activitySvc.getLeftEnergy().then((energy: number) => this.leftEnergy = energy);

    this._activitySvc.getActivityPlan$().subscribe((activityPlan: ActivityPlan) => {
      console.log('Received activity plan: ', activityPlan);
      this.activityPlan = activityPlan;
      this.activityPlan.intellectualActivities = this.activityPlan.intellectualActivities || [];
      this.activityPlan.physicalActivities = this.activityPlan.physicalActivities || [];
      this.activityPlan.warnings = this.activityPlan.warnings || [];
      loader.dismiss();
      this._detectorRef.markForCheck();
    });
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
