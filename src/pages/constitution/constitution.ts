// App
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Firebase
import { FirebaseObjectObservable } from 'angularfire2'

// Models
import { IConstitution } from '../../models';

// Providers
import { ConstitutionService } from '../../providers';

@Component({
  selector: 'page-constitution',
  templateUrl: 'constitution.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConstitutionPage {
  public constitutions: FirebaseObjectObservable<IConstitution>;
  public dosha: string = 'vata';
  constructor(
    private _constitutionSvc: ConstitutionService,
    private _detectorRef: ChangeDetectorRef,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {  }

  public addPoints(ev: string, idx: number, type: string): void {
    this._constitutionSvc.addPoints(ev, this.dosha, type, idx);
  }

  ionViewWillEnter(): void {
    this.constitutions = this._constitutionSvc.getConstitutions();
    this._detectorRef.markForCheck();
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
