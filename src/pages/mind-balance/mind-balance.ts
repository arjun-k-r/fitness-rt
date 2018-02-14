// Angular
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  AlertController,
  IonicPage,
  NavController
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseError, User } from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { ILineChartColors, ILineChartEntry, MindBalance } from '../../models';

// Providers
import { NotificationProvider, MindBalanceProvider } from '../../providers';

const CURRENT_DAY: string = moment().format('YYYY-MM-DD');
@IonicPage({
  name: 'mind-balance'
})
@Component({
  templateUrl: 'mind-balance.html'
})
export class MindBalancePage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _mindBalanceSubscription: Subscription;
  private _trends: MindBalance[] = [];
  private _trendSubscription: Subscription;
  public chartColors: ILineChartColors[] = [];
  public chartData: ILineChartEntry[] = [];
  public chartDataSelection: string = 'stress';
  public chartLabels: string[] = [];
  public chartOpts: any = { responsive: true };
  public maxDateSelection: string = CURRENT_DAY;
  public pageSegment: string = 'today';
  public mindBalance: MindBalance;
  public mindBalanceDate: string = CURRENT_DAY;
  public trendDays: number = 7;
  public unsavedChanges: boolean = false;
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _navCtrl: NavController,
    private _notifyPvd: NotificationProvider,
    private _mindBalancePvd: MindBalanceProvider
  ) {
    this.chartColors.push({
      backgroundColor: 'rgb(255, 255, 255)',
      borderColor: '#4dd87b',
      pointBackgroundColor: '#4dd87b',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#4dd87b'
    });
    this.mindBalance = new MindBalance(CURRENT_DAY, '', '', 0, '');
  }

  private _getTrends(): void {
    this._trendSubscription = this._mindBalancePvd.getTrends$(this._authId, +this.trendDays).subscribe(
      (trends: MindBalance[] = []) => {
        this.chartLabels = [...trends.map((t: MindBalance) => t.date)];
        this._trends = [...trends];
        this.chartData = [{
          data: [...this._trends.map((m: MindBalance) => m.stress)],
          label: 'Stress levels'
        }];
      },
      (err: FirebaseError) => {
        this._notifyPvd.showError(err.message);
      }
    );
  }

  public changeChartData(): void {
    switch (this.chartDataSelection) {
      case 'stress':
        this.chartData = [{
          data: [...this._trends.map((m: MindBalance) => m.stress)],
          label: 'Stress levels'
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
    this._mindBalancePvd.changeTrendDays(+this.trendDays || 1);
  }

  public getMindBalance(): void {
    this._notifyPvd.showLoading();
    if (this._mindBalanceSubscription) {
      this._mindBalanceSubscription.unsubscribe();
    }
    this._mindBalanceSubscription = this._mindBalancePvd.getMindBalance$(this._authId, this.mindBalanceDate).subscribe((m: MindBalance) => {
      if (!!m && m['$value'] !== null) {
        this.mindBalance = Object.assign({}, m);
        this._notifyPvd.closeLoading();
      }
      this.mindBalance.date = this.mindBalanceDate;
    }, (err: FirebaseError) => {
      this._notifyPvd.closeLoading();
      this._notifyPvd.showError(err.message);
    });
  }

  public save(): void {
    this._notifyPvd.showLoading();
    this._mindBalancePvd.saveMindBalance(this._authId, this.mindBalance, this._trends)
      .then(() => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showInfo('Mind balance saved successfully!');
      }).catch((err: FirebaseError) => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showError(err.message);
      })
  }

  public takeStressTest(): void {
    this._navCtrl.push('stress-questionaire');
  }

  public takeVikrutiTest(): void {
    this._navCtrl.push('vikruti-questionaire');
  }

  public viewEmotions(): void {
    this._navCtrl.push('emotions-list');
  }

  public viewLifestyleGuidelines(): void {
    this._navCtrl.push('lifestyle-guidelines');
  }

  public viewPageInfo(): void {
    this._navCtrl.push('mind-balance-info');
  }

  ionViewCanEnter(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this._afAuth.authState.subscribe((auth: User) => {
        if (!auth) {
          reject();
          this._navCtrl.setRoot('registration', {
            history: 'mind-balance'
          });
        }
        resolve();
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
        this.getMindBalance();
        this._getTrends();
      }
    })
  }

  ionViewWillLeave(): void {
    this._authSubscription.unsubscribe();
    this._mindBalanceSubscription.unsubscribe();
    this._trendSubscription.unsubscribe();
  }
}
