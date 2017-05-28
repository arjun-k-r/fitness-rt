// App
import { Component } from '@angular/core';
import { Alert, AlertController, Loading, LoadingController, Modal, ModalController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

// Models
import { Activity, ActivityPlan, WarningMessage } from '../../models';

// Pages
import { ActivitySelectPage } from '../activity-select/activity-select';

// Providers
import { ActivityService, FitnessService } from '../../providers';

@Component({
  selector: 'page-activity-plan',
  templateUrl: 'activity-plan.html'
})
export class ActivityPlanPage {
  private _activityPlanSubscription: Subscription;
  public activityPlan: ActivityPlan;
  public activityPlanDetails: string = 'guidelines';
  public leftEnergy: number = 0;
  constructor(
    private _activitySvc: ActivityService,
    private _alertCtrl: AlertController,
    private _fitSvc: FitnessService,
    private _loadCtrl: LoadingController,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController
  ) { }

  private _updateActivityPlan(activity: Activity): void {
    if (activity.type === 'Physical') {
      this.activityPlan.physicalActivities = [...this.activityPlan.physicalActivities, activity];
      this.activityPlan.physicalEffort = this._activitySvc.getActivitiesDuration(this.activityPlan.physicalActivities);
    } else if (activity.type === 'Intellectual') {
      this.activityPlan.intellectualActivities = [...this.activityPlan.intellectualActivities, activity];
      this.activityPlan.intellectualEffort = this._activitySvc.getActivitiesDuration(this.activityPlan.intellectualActivities);
    }

    this.activityPlan.totalEnergyBurn = this._activitySvc.getTotalEnergyBurn([...this.activityPlan.intellectualActivities, ...this.activityPlan.physicalActivities]);
    this._activitySvc.updateUserRequirements(this.activityPlan.totalEnergyBurn);
    this._activitySvc.getLeftEnergy().then((energy: number) => this.leftEnergy = energy);
  }

  public addNewActivity(): void {
    let activitySelectModal: Modal = this._modalCtrl.create(ActivitySelectPage);
    activitySelectModal.present();
    activitySelectModal.onDidDismiss((activity: Activity) => this._updateActivityPlan(activity));
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
          }
        }
      ]
    });
    alert.present();
  }

  public removeActivity(idx: number, type: string): void {
    if (type === 'physical') {
      this.activityPlan.physicalActivities = [...this.activityPlan.physicalActivities.slice(0, idx), ...this.activityPlan.physicalActivities.slice(idx + 1)];
    } else {
      this.activityPlan.intellectualActivities = [...this.activityPlan.intellectualActivities.slice(0, idx), ...this.activityPlan.intellectualActivities.slice(idx + 1)];
    }
  }

  public saveActivityPlan(): void {
    this._activitySvc.saveActivityPlan(this.activityPlan);
    this._activitySvc.getLeftEnergy().then((energy: number) => {
      this.leftEnergy = energy;
      console.log(energy);
    });
  }

  public viewSymptoms(imbalanceKey: string, imbalanceName: string, imbalanceType: string): void {
    this._fitSvc.getImbalanceSymptoms$(imbalanceKey, imbalanceType).subscribe((signs: Array<string>) => {
      this._alertCtrl.create({
        title: `${imbalanceName} ${imbalanceType} symptoms`,
        subTitle: 'Check the symptoms which fit you',
        inputs: [...signs.map((sign: string) => {
          return {
            type: 'checkbox',
            label: sign,
            value: sign
          }
        })],
        buttons: [
          {
            text: 'Done',
            handler: (data: Array<string>) => {
              console.log('My symptoms are: ', data);
            }
          }
        ]
      }).present();
    });
  }

  ionViewDidLoad(): void {
    let loader: Loading = this._loadCtrl.create({
      content: 'Loading...',
      spinner: 'crescent'
    });

    loader.present();
    this._activitySvc.getLeftEnergy().then((energy: number) => this.leftEnergy = energy);

    this._activityPlanSubscription = this._activitySvc.getActivityPlan$().subscribe((activityPlan: ActivityPlan) => {
      console.log('Received activity plan: ', activityPlan);
      this.activityPlan = Object.assign({}, activityPlan);
      this.activityPlan.intellectualActivities = this.activityPlan.intellectualActivities || [];
      this.activityPlan.physicalActivities = this.activityPlan.physicalActivities || [];
      loader.dismiss();
    });
  }

  ionViewWillLeave(): void {
    this._activityPlanSubscription.unsubscribe();
  }

}
