// App
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Models
import { ConstitutionQuizCharacterstic, ConstitutionQuizQuestion } from '../../models';

// Pages
import { ProfilePage } from '../profile/profile';

// Providers
import { AlertService, ConstitutionService } from '../../providers';

@Component({
  selector: 'page-constitution',
  templateUrl: 'constitution.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConstitutionPage {
  public constitutionQuestions: Array<ConstitutionQuizQuestion> = [];
  constructor(
    private _alertSvc: AlertService,
    private _constitutionSvc: ConstitutionService,
    private _detectorRef: ChangeDetectorRef,
    private _navCtrl: NavController,
    private _params: NavParams
  ) { }

  public checkCharacteristic(characteristic: ConstitutionQuizCharacterstic, questionIdx: number): void {
    this.constitutionQuestions[questionIdx].characteristics.forEach((c: ConstitutionQuizCharacterstic) => c.checked = false);
    characteristic.checked = true;
  }

  public finishQuiz(): void {
    this._constitutionSvc.saveConstitution(this.constitutionQuestions).then(() => this._navCtrl.setRoot(ProfilePage, { new: true }))
  }

  ionViewWillEnter(): void {
    this._alertSvc.showAlert('We need to establish your unique constitution', 'Please complete the following quiz', 'Step 1');

    this._constitutionSvc.getConstitutionQuestions().subscribe((questions: Array<ConstitutionQuizQuestion>) => {
      this.constitutionQuestions = questions;
      this._detectorRef.markForCheck();
    });
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
