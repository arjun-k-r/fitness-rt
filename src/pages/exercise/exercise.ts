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
import { Activity, Exercise, ILineChartColors, ILineChartEntry, UserProfile } from '../../models';

// Providers
import { ExerciseProvider, NotificationProvider, UserProfileProvider } from '../../providers';

const CURRENT_DAY: string = moment().format('YYYY-MM-DD');

@IonicPage({
  name: 'exercise'
})
@Component({
  templateUrl: 'exercise.html',
})
export class ExercisePage {
  private authId: string;
  private authSubscription: Subscription;
  private exerciseSubscription: Subscription;
  private trends: Exercise[] = [];
  private trendSubscription: Subscription;
  private userProfile: UserProfile;
  private userSubscription: Subscription;
  public chartColors: ILineChartColors[] = [];
  public chartData: ILineChartEntry[] = [];
  public chartDataSelection: string = 'energyBurn';
  public chartLabels: string[] = [];
  public chartOpts: any = { responsive: true };
  public exercise: Exercise;
  public exerciseDate: string = CURRENT_DAY;
  public maxDateSelection: string = CURRENT_DAY;
  public pageSegment: string = 'today';
  public trendDays: number = 7;
  public unsavedChanges: boolean = false;
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private exercisePvd: ExerciseProvider,
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
    this.exercise = new Exercise(
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
            activity.energyBurn = this.exercisePvd.calculateActivityEnergyBurn(activity, this.userProfile.measurements.weight)
            this.updateExercise();
          }
        }
      ]
    }).present();
  }

  private removeActivity(idx: number): void {
    this.exercise.activities = [...this.exercise.activities.slice(0, idx), ...this.exercise.activities.slice(idx + 1)];
    this.updateExercise();
  }

  private getTrends(): void {
    this.trendSubscription = this.exercisePvd.getTrends$(this.authId, +this.trendDays).subscribe(
      (trends: Exercise[] = []) => {
        this.chartLabels = [...trends.map((t: Exercise) => t.date)];
        this.trends = [...trends];
        this.chartData = [{
          data: [...this.trends.map((e: Exercise) => e.energyBurn)],
          label: 'Energy burn'
        }];
      },
      (err: FirebaseError) => {
        this.notifyPvd.showError(err.message);
      }
    );
  }

  private updateExercise(): void {
    this.changeMade();
    this.exercise.duration = this.exercise.activities.reduce((acc: number, currActivity: Activity) => acc += currActivity.duration, 0);
    this.exercise.energyBurn = this.exercise.activities.reduce((acc: number, currActivity: Activity) => acc += currActivity.energyBurn, 0);
  }

  public addActivity(): void {
    const activityListModal: Modal = this.modalCtrl.create('activity-list', { authId: this.authId });
    activityListModal.present();
    activityListModal.onDidDismiss((activities: Activity[]) => {
      if (!!activities && !!activities.length) {
        activities.forEach((a: Activity) => a.energyBurn = this.exercisePvd.calculateActivityEnergyBurn(a, this.userProfile.measurements.weight))
        this.exercise.activities = [...this.exercise.activities, ...activities];
        this.updateExercise();
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
            this.changeDuration(this.exercise.activities[idx]);
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
          data: [...this.trends.map((e: Exercise) => e.energyBurn)],
          label: 'Energy Burn'
        }];
        break;

      case 'duration':
        this.chartData = [{
          data: [...this.trends.map((e: Exercise) => e.duration)],
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
    this.exercisePvd.changeTrendDays(+this.trendDays || 1);
  }

  public getExercise(): void {
    this.notifyPvd.showLoading();
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    this.exerciseSubscription = this.exercisePvd.getExercise$(this.authId, this.exerciseDate).subscribe((e: Exercise) => {
      if (!!e && e['$value'] !== null) {
        this.exercise = Object.assign({}, e);
        this.exercise.activities = this.exercise.activities || [];
        this.notifyPvd.closeLoading();
      }
      this.exercise.date = this.exerciseDate;
    }, (err: FirebaseError) => {
      this.notifyPvd.closeLoading();
      this.notifyPvd.showError(err.message);
    });
  }

  public save(): void {
    this.notifyPvd.showLoading();
    this.exercisePvd.saveExercise(this.authId, this.exercise, this.trends)
      .then(() => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showInfo('Exercise saved successfully!');
      }).catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      })
  }

  public takeOvertrainingTest(): void {
    this.navCtrl.push('overtraining-questionaire');
  }

  public viewExerciseGuidelines(): void {
    this.navCtrl.push('exercise-guidelines', { constitution: this.userProfile.constitution })
  }

  public viewMuscleGroups(): void {
    this.navCtrl.push('muscle-group-list');
  }

  public viewPageInfo(): void {
    this.navCtrl.push('exercise-info');
  }

  ionViewCanEnter(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe((auth: User) => {
        if (!auth) {
          reject();
          this.navCtrl.setRoot('registration', {
            history: 'exercise'
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
        this.getExercise();
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
    this.exerciseSubscription.unsubscribe();
    this.trendSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

}
