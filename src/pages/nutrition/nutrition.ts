// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-nutrition',
  templateUrl: 'nutrition.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NutritionPage {

  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _navCtrl: NavController
  ) { }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
