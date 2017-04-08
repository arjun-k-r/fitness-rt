// App
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

// Models
import { IConstitution, IConstitutions } from '../../models';

// Providers
import { ConstitutionService } from '../../providers';

@Component({
  selector: 'page-constitution',
  templateUrl: 'constitution.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConstitutionPage {
  public constitutions: Array<IConstitution> = [];
  public dosha: string = 'vata';
  public prakruti: string;
  public quizProgress: number = 0;
  constructor(
    private _alertCtrl: AlertController,
    private _constitutionSvc: ConstitutionService,
    private _detectorRef: ChangeDetectorRef,
    private _navCtrl: NavController,
    private _params: NavParams
  ) { }

  public addPoints(ev: string, idx: number, type: string): void {
    this._constitutionSvc.addPoints(ev, this.dosha, type, idx);
  }

  public finishQuiz(): void {
    this._constitutionSvc.savePrakruti();
  }

  public nextQuiz(): void {
    this.quizProgress++;
    this.dosha = this.quizProgress === 1 ? 'pitta' : 'kapha';
  }

  public previousQuiz(): void {
    this.quizProgress--;
    this.dosha = this.quizProgress === 1 ? 'pitta' : 'vata';
  }

  ionViewWillEnter(): void {
    let greetAlert = this._alertCtrl.create({
      title: 'You are unique!',
      subTitle: 'Before we begin, I want to know a little more about you',
      message: "Please omplete this quiz so I can have an overall image about your constitution",
      buttons: ['Sure']
    });
    greetAlert.present();

    this._constitutionSvc.getConstitutions().subscribe((constitutions: IConstitutions) => {
      this.constitutions.push(constitutions.vata);
      this.constitutions.push(constitutions.pitta);
      this.constitutions.push(constitutions.kapha);
      this._detectorRef.markForCheck();
    });
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
