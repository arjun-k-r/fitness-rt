// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';

// Pages
import { ConstitutionPage } from '../constitution/constitution';

@Component({
  selector: 'page-getting-started',
  templateUrl: 'getting-started.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GettingStartedPage {
  @ViewChild(Slides) private _slider: Slides;
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _navCtrl: NavController
  ) {}

  public takeQuiz(): void {
    this._navCtrl.setRoot(ConstitutionPage);
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
