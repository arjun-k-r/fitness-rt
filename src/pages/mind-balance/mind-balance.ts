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
  private authId: string;
  private authSubscription: Subscription;
  private mindBalanceSubscription: Subscription;
  private trends: MindBalance[] = [];
  private trendSubscription: Subscription;
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
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private notifyPvd: NotificationProvider,
    private mindBalancePvd: MindBalanceProvider
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

  private getTrends(): void {
    this.trendSubscription = this.mindBalancePvd.getTrends$(this.authId, +this.trendDays).subscribe(
      (trends: MindBalance[] = []) => {
        this.chartLabels = [...trends.map((t: MindBalance) => t.date)];
        this.trends = [...trends];
        this.chartData = [{
          data: [...this.trends.map((m: MindBalance) => m.stress)],
          label: 'Stress levels'
        }];
      },
      (err: FirebaseError) => {
        this.notifyPvd.showError(err.message);
      }
    );
  }

  public changeChartData(): void {
    switch (this.chartDataSelection) {
      case 'stress':
        this.chartData = [{
          data: [...this.trends.map((m: MindBalance) => m.stress)],
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
    this.mindBalancePvd.changeTrendDays(+this.trendDays || 1);
  }

  public getMindBalance(): void {
    this.notifyPvd.showLoading();
    if (this.mindBalanceSubscription) {
      this.mindBalanceSubscription.unsubscribe();
    }
    this.mindBalanceSubscription = this.mindBalancePvd.getMindBalance$(this.authId, this.mindBalanceDate).subscribe((m: MindBalance) => {
      if (!!m && m['$value'] !== null) {
        this.mindBalance = Object.assign({}, m);
        this.notifyPvd.closeLoading();
      }
      this.mindBalance.date = this.mindBalanceDate;
    }, (err: FirebaseError) => {
      this.notifyPvd.closeLoading();
      this.notifyPvd.showError(err.message);
    });
  }

  public save(): void {
    this.notifyPvd.showLoading();
    this.mindBalancePvd.saveMindBalance(this.authId, this.mindBalance, this.trends)
      .then(() => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showInfo('Mind balance saved successfully!');
      }).catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      })
  }

  public takeStressTest(): void {
    this.navCtrl.push('stress-questionaire');
  }

  public takeVikrutiTest(): void {
    this.navCtrl.push('vikruti-questionaire');
  }

  public viewEmotions(): void {
    this.navCtrl.push('emotions-list');
  }

  public viewLifestyleGuidelines(): void {
    this.navCtrl.push('lifestyle-guidelines');
  }

  public viewPageInfo(): void {
    this.navCtrl.push('mind-balance-info');
  }

  ionViewCanEnter(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe((auth: User) => {
        if (!auth) {
          reject();
          this.navCtrl.setRoot('registration', {
            history: 'mind-balance'
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
        this.getMindBalance();
        this.getTrends();
      }
    }, (err: FirebaseError) => {
      this.notifyPvd.showError(err.message);
    })
  }

  ionViewWillLeave(): void {
    this.authSubscription.unsubscribe();
    this.mindBalanceSubscription.unsubscribe();
    this.trendSubscription.unsubscribe();
  }
}
