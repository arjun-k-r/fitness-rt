// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

// Models
//import { INutrientDetails } from '../../models';

// Providers
import { NutrientService } from '../../providers';

@Component({
  selector: 'page-nutrient',
  templateUrl: 'nutrient.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NutrientPage {
  public nutrient$: Observable<any>;
  public nutrientDetail: string = 'summary';
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _nutrientSvc: NutrientService
  ) { }

  ionViewWillEnter(): void {
    this.nutrient$ = this._nutrientSvc.getNutrient$(this._navParams.get('id'));
    this._detectorRef.markForCheck();
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}