// App
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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
    private _constitutionSvc: ConstitutionService,
    private _detectorRef: ChangeDetectorRef,
    private _navCtrl: NavController,
    private _params: NavParams
  ) { }

  public addPoints(ev: string, idx: number, type: string): void {
    this._constitutionSvc.addPoints(ev, this.dosha, type, idx);
  }

  public nextQuiz(): void {
    if (this.quizProgress < 2) {
      this.quizProgress++;
      this.dosha = this.quizProgress === 1 ? 'pitta' : 'kapha';
    } else {
      this.prakruti = this._constitutionSvc.getPrakruti();
      console.log(this.prakruti);
    }
  }

  ionViewWillEnter(): void {
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
