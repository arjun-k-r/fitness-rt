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
import { Diet, ILineChartColors, ILineChartEntry, NutritionalValues } from '../../models';

// Providers
import { DietProvider, NotificationProvider } from '../../providers';

const CURRENT_DAY: string = moment().format('YYYY-MM-DD');

@IonicPage({
  name: 'diet'
})
@Component({
  templateUrl: 'diet.html',
})
export class DietPage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _dietSubscription: Subscription;
  private _trends: Diet[] = [];
  private _trendSubscription: Subscription;
  public chartColors: ILineChartColors[] = [];
  public chartData: ILineChartEntry[] = [];
  public chartDataSelection: string = 'energy';
  public chartLabels: string[] = [];
  public chartOpts: any = { responsive: true };
  public diet: Diet;
  public dietDate: string = CURRENT_DAY;
  public maxDateSelection: string = CURRENT_DAY;
  public nutrients: string[];
  public pageSegment: string = 'today';
  public trendDays: number = 7;
  constructor(
    private _afAuth: AngularFireAuth,
    private _dietPvd: DietProvider,
    private _navCtrl: NavController,
    private _notifyPvd: NotificationProvider
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

  private _getTrends(): void {
    this._trendSubscription = this._dietPvd.getTrends$(this._authId, +this.trendDays).subscribe(
      (trends: Diet[] = []) => {
        this.chartLabels = [...trends.map((t: Diet) => t.date)];
        this._trends = [...trends];
        this.chartData = [{
          data: [...this._trends.map((d: Diet) => d.nourishment.energy.value)],
          label: 'Energy intake'
        }];
      },
      (err: FirebaseError) => {
        this._notifyPvd.showError(err.message);
      }
    );
  }

  public addMeal(): void {
    this._navCtrl.push('meal-details', {
      authId: this._authId,
      id: this.diet.meals.length,
      diet: this.diet,
      trends: this._trends
    });
  }

  public changeChartData(): void {
    this.chartData = [{
      data: [...this._trends.map((d: Diet) => d.nourishment[this.chartDataSelection].value)],
      label: `${this.diet.nourishment[this.chartDataSelection].name} intake`
    }];
  }

  public changeTrendDays(): void {
    this._dietPvd.changeTrendDays(+this.trendDays || 1);
  }

  public editMeal(idx: number): void {
    this._navCtrl.push('meal-details', {
      authId: this._authId,
      id: idx + 1,
      mealIdx: idx,
      diet: this.diet,
      trends: this._trends
    });
  }

  public getDiet(): void {
    this._notifyPvd.showLoading();
    if (this._dietSubscription) {
      this._dietSubscription.unsubscribe();
    }
    this._dietSubscription = this._dietPvd.getDiet$(this._authId, this.dietDate).subscribe((s: Diet) => {
      if (!!s && s['$value'] !== null) {
        this.diet = Object.assign({}, s);
        this.nutrients = Object.keys(this.diet.nourishment);
        this._notifyPvd.closeLoading();
      }
    }, (err: FirebaseError) => {
      this._notifyPvd.closeLoading();
      this._notifyPvd.showError(err.message);
    });
  }

  public viewPageInfo(): void {
    this._navCtrl.push('diet-info');
  }

  ionViewCanEnter(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this._afAuth.authState.subscribe((auth: User) => {
        if (!auth) {
          reject();
          this._navCtrl.setRoot('registration', {
            history: 'diet'
          });
        }
        resolve();
      })
    });
  }

  ionViewWillEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: User) => {
      if (!!auth) {
        this._authId = auth.uid;
        this.getDiet();
        this._getTrends();
      }
    })
  }

  ionViewWillLeave(): void {
    this._authSubscription.unsubscribe();
    this._dietSubscription.unsubscribe();
    this._trendSubscription.unsubscribe();
  }

}
