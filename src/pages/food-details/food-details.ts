// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Models
import { Food } from '../../models';

// Providers
import { FoodService } from '../../providers';

@Component({
  selector: 'page-food-details',
  templateUrl: 'food-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodDetailsPage {
  public food: Food;
  //public foodNutrition: Array<Nutrient> = [];
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _foodSvc: FoodService,
    private _navCtrl: NavController,
    private _navParams: NavParams
  ) { }

  ionViewWillEnter(): void {
    this._foodSvc.getFoodReports$(this._navParams.get('id')).then((data: Food) => {
      this.food = data;
      this._detectorRef.markForCheck();
     // this.foodNutrition = <Array<Nutrient>>_.values(this.food.nutrition);
    }).catch((err: Error) => {
        console.log(err);
        this._navCtrl.pop();
      })
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
