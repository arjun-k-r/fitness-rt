// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert, AlertController, Loading, LoadingController, Modal, ModalController, NavController } from 'ionic-angular';
import { IPedometerData, Pedometer } from '@ionic-native/pedometer';

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
  public steps: number = 0;
  constructor(
    private _activitySvc: ActivityService,
    private _alertCtrl: AlertController,
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _fitSvc: FitnessService,
    private _loadCtrl: LoadingController,
    private _modalCtrl: ModalController,
    private _pedometer: Pedometer,
    private _navCtrl: NavController
  ) { }

  public addNewActivity(): void {
    let activitySelectModal: Modal = this._modalCtrl.create(ActivitySelectPage),
      warning: WarningMessage;
    activitySelectModal.present();
    activitySelectModal.onDidDismiss((activity: Activity) => {
      console.log('Selected: ', activity);
      warning = this._activitySvc.checkActivity(activity);
      if (!!warning) {
        this._alertSvc.showAlert(warning.moreInfo, 'Try to rethink your activity', warning.message);
      }

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

      this._detectorRef.detectChanges();
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
            this._detectorRef.detectChanges();
          }
        }
      ]
    });
    alert.present();
  }

  public measureSteps(): void {
    this._pedometer.startPedometerUpdates()
      .subscribe((data: IPedometerData) => {
        //this.steps = data.numberOfSteps;
        alert(data);
        this._detectorRef.detectChanges();
      });
  }

  public removeActivity(idx: number, type: string): void {
    if (type === 'physical') {
      this.activityPlan.physicalActivities.splice(idx, 1);
    } else {
      this.activityPlan.intellectualActivities.splice(idx, 1);
    }
  }

  public saveActivityPlan(): void {
    this._activitySvc.saveActivityPlan(this.activityPlan);
    this._activitySvc.getLeftEnergy().then((energy: number) => {
      this.leftEnergy = energy;
      console.log(energy);
      this._detectorRef.detectChanges();
    });
  }

  public segmentChange(): void {
    this._detectorRef.detectChanges();
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
              if (data.length > signs.length / 4) {
                if (imbalanceType === 'deficiency') {
                  this._alertSvc.showAlert('Try to slow it down and offer your body the rest it deserves, okay?', 'Relaxation is as important as exercise', 'The time is now to make a change');
                } else {
                  this._alertSvc.showAlert('Try to exercise with moderation every single day, okay?', "If you don't use it, you'll lose it", 'The time is now to make a change');
                }
              } else {
                this._alertSvc.showAlert("Anyway, make sure to take care of your nutrition and don't abuse or neglect any nutrient, okay?", '', 'I am not perfect');
              }
            }
          }
        ]
      }).present();
    });
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
      this._detectorRef.detectChanges();
    });
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
