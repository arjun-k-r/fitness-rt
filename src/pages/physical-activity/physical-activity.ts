// Angular
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  Modal,
  ModalController,
  NavController
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseError, User } from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Activity, ILineChartColors, ILineChartEntry, PhysicalActivityLog, UserProfile, Workout } from '../../models';

// Providers
import { PhysicalActivityProvider, NotificationProvider, UserProfileProvider } from '../../providers';

const CURRENT_DAY: string = moment().format('YYYY-MM-DD');

@IonicPage({
  name: 'physical-activity'
})
@Component({
  templateUrl: 'physical-activity.html',
})
export class PhysicalActivityPage {
  private authId: string;
  private authSubscription: Subscription;
  private physicalActivityLogSubscription: Subscription;
  private trends: PhysicalActivityLog[] = [];
  private trendSubscription: Subscription;
  private userProfile: UserProfile;
  private userSubscription: Subscription;
  public chartColors: ILineChartColors[] = [];
  public chartData: ILineChartEntry[] = [];
  public chartDataSelection: string = 'energyBurn';
  public chartLabels: string[] = [];
  public chartOpts: any = { responsive: true };
  public physicalActivityLog: PhysicalActivityLog;
  public physicalActivityLogDate: string = CURRENT_DAY;
  public maxDateSelection: string = moment().add(1, 'years').format('YYYY-MM-DD');
  public minDateSelection: string = moment().subtract(1, 'years').format('YYYY-MM-DD');
  public pageSegment: string = 'today';
  public trendDays: number = 7;
  public unsavedChanges: boolean = false;
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private physicalActivityPvd: PhysicalActivityProvider,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private notifyPvd: NotificationProvider,
    private userPvd: UserProfileProvider
  ) {
    this.chartColors.push({
      backgroundColor: 'rgb(255, 255, 255)',
      borderColor: '#4dd87b',
      pointBackgroundColor: '#4dd87b',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#4dd87b'
    });
    this.physicalActivityLog = new PhysicalActivityLog(
      [],
      CURRENT_DAY,
      0,
      0,
      ''
    );
  }

  private changeDuration(activity: Activity): void {
    this.alertCtrl.create({
      title: 'Duration',
      subTitle: `How much ${activity.category}, ${activity.name} did you perform?`,
      inputs: [
        {
          name: 'duration',
          placeholder: `${activity.duration.toString()} mins`,
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
          handler: (data: { duration: string }) => {
            activity.duration = +data.duration;
            activity.energyBurn = this.physicalActivityPvd.calculateActivityEnergyBurn(activity, this.userProfile.measurements.weight)
            this.updatePhysicalActivityLog();
          }
        }
      ]
    }).present();
  }

  private removeActivity(idx: number): void {
    this.physicalActivityLog.activities = [...this.physicalActivityLog.activities.slice(0, idx), ...this.physicalActivityLog.activities.slice(idx + 1)];
    this.updatePhysicalActivityLog();
  }

  private getTrends(): void {
    this.trendSubscription = this.physicalActivityPvd.getTrends$(this.authId, +this.trendDays).subscribe(
      (trends: PhysicalActivityLog[] = []) => {
        this.chartLabels = [...trends.map((t: PhysicalActivityLog) => t.date)];
        this.trends = [...trends];
        this.chartData = [{
          data: [...this.trends.map((e: PhysicalActivityLog) => e.energyBurn)],
          label: 'Energy burn'
        }];
      },
      (err: FirebaseError) => {
        this.notifyPvd.showError(err.message);
      }
    );
  }

  private updatePhysicalActivityLog(): void {
    this.changeMade();
    this.physicalActivityLog.duration = this.physicalActivityLog.activities.reduce((acc: number, currActivity: Activity | Workout) => acc += currActivity.duration, 0);
    this.physicalActivityLog.energyBurn = this.physicalActivityLog.activities.reduce((acc: number, currActivity: Activity | Workout) => acc += currActivity.energyBurn, 0);
  }

  public addActivity(): void {
    const activityListModal: Modal = this.modalCtrl.create('activity-list', { authId: this.authId, userWeight: this.userProfile.measurements.weight });
    activityListModal.present();
    activityListModal.onDidDismiss((activities: Activity[]) => {
      if (!!activities && !!activities.length) {
        activities.forEach((a: Activity) => {
          a.energyBurn = this.physicalActivityPvd.calculateActivityEnergyBurn(a, this.userProfile.measurements.weight)
        })
        this.physicalActivityLog.activities = [...this.physicalActivityLog.activities, ...activities];
        this.updatePhysicalActivityLog();
      }
    });
  }

  public changeActivity(idx: number): void {
    this.actionSheetCtrl.create({
      title: 'Change activity',
      buttons: [
        {
          text: 'Change duration',
          handler: () => {
            this.changeDuration(this.physicalActivityLog.activities[idx]);
          }
        }, {
          text: 'Remove it',
          handler: () => {
            this.removeActivity(idx);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();
  }

  public changeChartData(): void {
    switch (this.chartDataSelection) {
      case 'energyBurn':
        this.chartData = [{
          data: [...this.trends.map((e: PhysicalActivityLog) => e.energyBurn)],
          label: 'Energy Burn'
        }];
        break;

      case 'duration':
        this.chartData = [{
          data: [...this.trends.map((e: PhysicalActivityLog) => e.duration)],
          label: 'Duration'
        }];
        break;


      default:
        break;
    }
  }

  public changeMade(): void {
    this.unsavedChanges = true;
  }

  public changeTrendDays(): void {
    this.physicalActivityPvd.changeTrendDays(+this.trendDays || 1);
  }

  public getPhysicalActivityLog(): void {
    this.notifyPvd.showLoading();
    if (this.physicalActivityLogSubscription) {
      this.physicalActivityLogSubscription.unsubscribe();
    }
    this.physicalActivityLog = new PhysicalActivityLog(
      [],
      this.physicalActivityLogDate,
      0,
      0,
      ''
    );
    this.physicalActivityLogSubscription = this.physicalActivityPvd.getPhysicalActivityLog$(this.authId, this.physicalActivityLogDate).subscribe((e: PhysicalActivityLog) => {
      if (!!e && e['$value'] !== null) {
        this.physicalActivityLog = Object.assign({}, e);
        this.physicalActivityLog.activities = this.physicalActivityLog.activities || [];
        this.notifyPvd.closeLoading();
      }
    }, (err: FirebaseError) => {
      this.notifyPvd.closeLoading();
      this.notifyPvd.showError(err.message);
    });
  }

  public save(): void {
    this.notifyPvd.showLoading();
    this.physicalActivityPvd.savePhysicalActivityLog(this.authId, this.physicalActivityLog, this.trends)
      .then(() => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showInfo('Physical activity log saved successfully!');
      }).catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      })
  }

  public takeOvertrainingTest(): void {
    this.navCtrl.push('overtraining-questionaire');
  }

  public viewPhysicalActivityLogGuidelines(): void {
    this.navCtrl.push('physical-activity-guidelines', { constitution: this.userProfile.constitution })
  }

  public viewMuscleGroups(): void {
    this.navCtrl.push('muscle-group-list');
  }

  public viewPageInfo(): void {
    this.navCtrl.push('physical-activity-info');
  }

  ionViewCanEnter(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe((auth: User) => {
        if (!auth) {
          reject();
          this.navCtrl.setRoot('registration', {
            history: 'physical-activity'
          });
        }
        resolve();
      }, (err: FirebaseError) => {
        reject(err);
      })
    });
  }

  ionViewCanLEave(): boolean | Promise<{}> {
    if (!this.unsavedChanges) {
      return true;
    }
    return new Promise((resolve, reject) => {
      if (this.unsavedChanges) {
        this.alertCtrl.create({
          title: 'Unsaved changes',
          message: 'All your changes will be lost. Are you sure you want to leave?',
          buttons: [
            {
              text: 'No',
              handler: () => {
                reject();
              }
            },
            {
              text: 'Yes',
              handler: () => {
                resolve();
              }
            }
          ]
        });
      }
    });
  }

  ionViewWillEnter(): void {
    this.authSubscription = this.afAuth.authState.subscribe((auth: User) => {
      if (!!auth) {
        this.authId = auth.uid;
        this.getPhysicalActivityLog();
        this.getTrends();
        this.userSubscription = this.userPvd.getUserProfile$(this.authId).subscribe((u: UserProfile) => {
          this.userProfile = u;
        });
      }
    }, (err: FirebaseError) => {
      this.notifyPvd.showError(err.message);
    })
  }

  ionViewWillLeave(): void {
    this.authSubscription.unsubscribe();
    this.physicalActivityLogSubscription.unsubscribe();
    this.trendSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

}
