// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Loading, LoadingController, NavController, NavParams } from 'ionic-angular';

// Models
import { Food } from '../../models';

// Providers
import { AlertService, FoodDataService } from '../../providers';

@Component({
  selector: 'page-food-details',
  templateUrl: 'food-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodDetailsPage {
  public food: Food;
  constructor(
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _foodDataSvc: FoodDataService,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _params: NavParams
  ) { }

  ionViewWillEnter(): void {
    let loader: Loading = this._loadCtrl.create({
      content: 'Loading...',
      spinner: 'crescent'
    });

    loader.present();
    this._foodDataSvc.getFoodReports$(this._params.get('id')).then((data: Food) => {
      this.food = data;
      loader.dismiss();
      this._detectorRef.markForCheck();
    }).catch((err: Error) => {
        this._alertSvc.showAlert(err.toString());
        loader.dismiss();
        this._navCtrl.pop();
      })
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
