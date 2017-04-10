// App
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

// Models
import { ConstitutionQuiz } from '../../models';

// Pages
import { ProfilePage } from '../profile/profile';

// Providers
import { ConstitutionService } from '../../providers';

@Component({
  selector: 'page-constitution',
  templateUrl: 'constitution.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConstitutionPage {
  public constitutionQuiz: ConstitutionQuiz = new ConstitutionQuiz();
  public prakruti: string;
  public quizProgress: string = 'vata';
  constructor(
    private _alertCtrl: AlertController,
    private _constitutionSvc: ConstitutionService,
    private _detectorRef: ChangeDetectorRef,
    private _navCtrl: NavController,
    private _params: NavParams
  ) { }

  public addPoints(ev: string, dosha: string, type: string, idx: number): void {
    this._constitutionSvc.addPoints(ev, dosha, type, idx);
    this._constitutionSvc.saveQuizProgress(this.constitutionQuiz);
    console.log(this.constitutionQuiz);
  }

  public finishQuiz(): void {
    this._constitutionSvc.savePrakruti().then(() => this._navCtrl.setRoot(ProfilePage, { new: true }))
  }

  public quizPageChange(): void {
    this._detectorRef.markForCheck();
  }

  ionViewWillEnter(): void {
    let greetAlert = this._alertCtrl.create({
      title: 'You are unique!',
      subTitle: 'Please complete this quiz so I can determine your unique constitution',
      message: 'Advice: Be honest with yourself when making choices',
      buttons: ['Sure']
    });
    greetAlert.present();

    this._constitutionSvc.getConstitutionQuiz().then((constitutionQuiz: ConstitutionQuiz) => {
      this.constitutionQuiz = Object.assign({}, constitutionQuiz);
      this._detectorRef.markForCheck();
    });
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
