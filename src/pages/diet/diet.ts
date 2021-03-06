// Angular
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  IonicPage,
  NavController
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseError, User } from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Diet, ILineChartColors, ILineChartEntry, NutritionalValues, UserProfile } from '../../models';

// Providers
import { DietProvider, NotificationProvider, UserProfileProvider } from '../../providers';

const CURRENT_DAY: string = moment().format('YYYY-MM-DD');

@IonicPage({
  name: 'diet'
})
@Component({
  templateUrl: 'diet.html',
})
export class DietPage {
  public chartColors: ILineChartColors[] = [];
  public chartData: ILineChartEntry[] = [];
  public chartDataSelection: string = 'energy';
  public chartLabels: string[] = [];
  public chartOpts: any = { responsive: true };
  public diet: Diet;
  public dietDate: string = CURRENT_DAY;
  public goal: number = 1;
  public maxDateSelection: string = moment().add(1, 'years').format('YYYY-MM-DD');
  public minDateSelection: string = moment().subtract(1, 'years').format('YYYY-MM-DD');
  public nutrients: string[];
  public pageSegment: string = 'today';
  public trendDays: number = 7;
  private authId: string;
  private authSubscription: Subscription;
  private dietSubscription: Subscription;
  private trends: Diet[] = [];
  private trendSubscription: Subscription;
  private userProfile: UserProfile;
  constructor(
    private afAuth: AngularFireAuth,
    private dietPvd: DietProvider,
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
    this.diet = new Diet(
      CURRENT_DAY,
      [],
      new NutritionalValues(),
      new NutritionalValues()
    );
  }

  public addMeal(): void {
    this.navCtrl.push('meal-details', {
      authId: this.authId,
      id: this.diet.meals.length,
      diet: this.diet,
      trends: this.trends
    });
  }

  public changeChartData(): void {
    this.chartData = [{
      data: [...this.trends.map((d: Diet) => d.nourishment[this.chartDataSelection].value)],
      label: `${this.diet.nourishment[this.chartDataSelection].name} intake`
    }];
  }

  public changeTrendDays(): void {
    this.dietPvd.changeTrendDays(+this.trendDays || 1);
  }

  public editMeal(idx: number): void {
    this.navCtrl.push('meal-details', {
      authId: this.authId,
      id: idx + 1,
      mealIdx: idx,
      diet: this.diet,
      trends: this.trends
    });
  }

  public getDiet(): void {
    this.notifyPvd.showLoading();
    if (this.dietSubscription) {
      this.dietSubscription.unsubscribe();
    }
    this.diet = new Diet(
      this.dietDate,
      [],
      new NutritionalValues(),
      new NutritionalValues()
    );
    this.dietSubscription = this.dietPvd.getDiet$(this.authId, this.dietDate).subscribe((s: Diet) => {
      if (!!s && s['$value'] !== null) {
        this.diet = Object.assign({}, s);
        this.diet.meals = this.diet.meals || [];
        this.nutrients = Object.keys(this.diet.nourishment);
        this.notifyPvd.closeLoading();
      }
      this.calculateRequirements();
    }, (err: FirebaseError) => {
      this.notifyPvd.closeLoading();
      this.notifyPvd.showError(err.message);
    });
  }

  public viewPageInfo(): void {
    this.navCtrl.push('diet-info');
  }

  ionViewCanEnter(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe((auth: User) => {
        if (!auth) {
          reject();
          this.navCtrl.setRoot('registration', {
            history: 'diet'
          });
        }
        resolve();
      }, (err: FirebaseError) => {
        reject(err);
      })
    });
  }

  ionViewWillEnter(): void {
    this.notifyPvd.showLoading();
    this.authSubscription = this.afAuth.authState.subscribe((auth: User) => {
      if (!!auth) {
        this.authId = auth.uid;

        // Update requirements according to exercise changes
        const userSubscription: Subscription = this.userPvd.getUserProfile$(this.authId).subscribe((u: UserProfile) => {
          if (!!u && u['$value'] !== null) {
            this.userProfile = Object.assign({}, u);
            userSubscription.unsubscribe();
          }
          this.dietSubscription = this.dietPvd.getDiet$(this.authId, this.dietDate).subscribe((s: Diet) => {
            if (!!s && s['$value'] !== null) {
              this.diet = Object.assign({}, s);
              this.diet.meals = this.diet.meals || [];
              this.calculateRequirements();
              this.nutrients = Object.keys(this.diet.nourishment);
              this.notifyPvd.closeLoading();
            }
          }, (err: FirebaseError) => {
            this.notifyPvd.closeLoading();
            this.notifyPvd.showError(err.message);
          });
          this.getTrends();
        }, (err: FirebaseError) => {
          this.notifyPvd.closeLoading();
          this.notifyPvd.showError(err.message);
        });
      }
    }, (err: FirebaseError) => {
      this.notifyPvd.closeLoading();
      this.notifyPvd.showError(err.message);
    });
  }

  ionViewWillLeave(): void {
    this.authSubscription.unsubscribe();
    this.dietSubscription.unsubscribe();
    this.trendSubscription.unsubscribe();
  }

  private calculateRequirements(): void {
    this.dietPvd.calculateRequirement(this.authId, this.userProfile.age, this.userProfile.fitness.bmr, this.userProfile.constitution, this.userProfile.gender, this.userProfile.fitness.goal, this.userProfile.isLactating, this.userProfile.isPregnant, this.userProfile.measurements.weight, this.diet.date)
      .then((r: NutritionalValues) => {
        this.diet.nourishmentAchieved = this.dietPvd.calculateNourishmentFromRequirement(this.diet.nourishment, r);
      })
      .catch((err: string) => {
        this.notifyPvd.showError(err);
      });
  }

  private getTrends(): void {
    this.trendSubscription = this.dietPvd.getTrends$(this.authId, +this.trendDays).subscribe(
      (trends: Diet[] = []) => {
        this.chartLabels = [...trends.map((t: Diet) => t.date)];
        this.trends = [...trends];
        this.chartData = [{
          data: [...this.trends.map((d: Diet) => d.nourishment.energy.value)],
          label: 'Energy intake'
        }];
      },
      (err: FirebaseError) => {
        this.notifyPvd.showError(err.message);
      }
    );
  }

}
