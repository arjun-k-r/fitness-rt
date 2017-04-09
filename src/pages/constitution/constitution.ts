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
  public prakruti: string;
  public quizProgress: string = 'vata';
  constructor(
    private _alertCtrl: AlertController,
    private _constitutionSvc: ConstitutionService,
    private _detectorRef: ChangeDetectorRef,
    private _navCtrl: NavController,
    private _params: NavParams
  ) { }

  public addPoints(ev: string, dosha: string, type: string, idx: number,): void {
    this._constitutionSvc.addPoints(ev, dosha, type, idx);
  }

  public finishQuiz(): void {
    this._constitutionSvc.savePrakruti();
  }

  ionViewWillEnter(): void {
    let greetAlert = this._alertCtrl.create({
      title: 'You are unique!',
      subTitle: 'Please complete this quiz so I can determine your unique constitution',
      message: 'Advice: Be honest with yourself when making choices',
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
