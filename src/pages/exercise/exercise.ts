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
  private _authId: string;
  private _authSubscription: Subscription;
  private _exerciseSubscription: Subscription;
  private _trends: Exercise[] = [];
  private _trendSubscription: Subscription;
  private _userProfile: UserProfile;
  private _userSubscription: Subscription;
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
    private _actionSheetCtrl: ActionSheetController,
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _exercisePvd: ExerciseProvider,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _notifyPvd: NotificationProvider,
    private _userPvd: UserProfileProvider
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

  private _changeDuration(activity: Activity): void {
    this._alertCtrl.create({
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
            activity.energyBurn = this._exercisePvd.calculateActivityEnergyBurn(activity, this._userProfile.measurements.weight)
            this._updateExercise();
          }
        }
      ]
    }).present();
  }

  private _removeActivity(idx: number): void {
    this.exercise.activities = [...this.exercise.activities.slice(0, idx), ...this.exercise.activities.slice(idx + 1)];
    this._updateExercise();
  }

  private _getTrends(): void {
    this._trendSubscription = this._exercisePvd.getTrends$(this._authId, +this.trendDays).subscribe(
      (trends: Exercise[] = []) => {
        this.chartLabels = [...trends.map((t: Exercise) => t.date)];
        this._trends = [...trends];
        this.chartData = [{
          data: [...this._trends.map((e: Exercise) => e.energyBurn)],
          label: 'Energy burn'
        }];
      },
      (err: FirebaseError) => {
        this._notifyPvd.showError(err.message);
      }
    );
  }

  private _updateExercise(): void {
    this.changeMade();
    this.exercise.duration = this.exercise.activities.reduce((acc: number, currActivity: Activity) => acc += currActivity.duration, 0);
    this.exercise.energyBurn = this.exercise.activities.reduce((acc: number, currActivity: Activity) => acc += currActivity.energyBurn, 0);
  }

  public addActivity(): void {
    const activityListModal: Modal = this._modalCtrl.create('activity-list', { authId: this._authId });
    activityListModal.present();
    activityListModal.onDidDismiss((activities: Activity[]) => {
      if (!!activities && !!activities.length) {
        activities.forEach((a: Activity) => a.energyBurn = this._exercisePvd.calculateActivityEnergyBurn(a, this._userProfile.measurements.weight))
        this.exercise.activities = [...this.exercise.activities, ...activities];
        this._updateExercise();
      }
    });
  }

  public changeActivity(idx: number): void {
    this._actionSheetCtrl.create({
      title: 'Change activity',
      buttons: [
        {
          text: 'Change duration',
          handler: () => {
            this._changeDuration(this.exercise.activities[idx]);
          }
        }, {
          text: 'Remove it',
          handler: () => {
            this._removeActivity(idx);
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
          data: [...this._trends.map((e: Exercise) => e.energyBurn)],
          label: 'Energy Burn'
        }];
        break;

      case 'duration':
        this.chartData = [{
          data: [...this._trends.map((e: Exercise) => e.duration)],
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
    this._exercisePvd.changeTrendDays(+this.trendDays || 1);
  }

  public getExercise(): void {
    this._notifyPvd.showLoading();
    if (this._exerciseSubscription) {
      this._exerciseSubscription.unsubscribe();
    }
    this._exerciseSubscription = this._exercisePvd.getExercise$(this._authId, this.exerciseDate).subscribe((e: Exercise) => {
      if (!!e && e['$value'] !== null) {
        this.exercise = Object.assign({}, e);
        this.exercise.activities = this.exercise.activities || [];
        this._notifyPvd.closeLoading();
      }
      this.exercise.date = this.exerciseDate;
    }, (err: FirebaseError) => {
      this._notifyPvd.closeLoading();
      this._notifyPvd.showError(err.message);
    });
  }

  public save(): void {
    this._notifyPvd.showLoading();
    this._exercisePvd.saveExercise(this._authId, this.exercise, this._trends)
      .then(() => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showInfo('Exercise saved successfully!');
      }).catch((err: FirebaseError) => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showError(err.message);
      })
  }

  public takeOvertrainingTest(): void {
    this._navCtrl.push('overtraining-questionaire');
  }

  public viewExerciseGuidelines(): void {
    this._navCtrl.push('exercise-guidelines', { constitution: this._userProfile.constitution })
  }

  public viewMuscleGroups(): void {
    this._navCtrl.push('muscle-group-list');
  }

  public viewPageInfo(): void {
    this._navCtrl.push('exercise-info');
  }

  ionViewCanEnter(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this._afAuth.authState.subscribe((auth: User) => {
        if (!auth) {
          reject();
          this._navCtrl.setRoot('registration', {
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
        this._alertCtrl.create({
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
    this._authSubscription = this._afAuth.authState.subscribe((auth: User) => {
      if (!!auth) {
        this._authId = auth.uid;
        this.getExercise();
        this._getTrends();
        this._userSubscription = this._userPvd.getUserProfile$(this._authId).subscribe((u: UserProfile) => {
          this._userProfile = u;
        });
      }
    }, (err: FirebaseError) => {
      this._notifyPvd.showError(err.message);
    })
  }

  ionViewWillLeave(): void {
    this._authSubscription.unsubscribe();
    this._exerciseSubscription.unsubscribe();
    this._trendSubscription.unsubscribe();
    this._userSubscription.unsubscribe();
  }

}
