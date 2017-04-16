// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Modal, ModalController, NavController, NavParams } from 'ionic-angular';

// Models
import { Food, Meal } from '../../models';

// Pages
import { MealSelectPage } from '../meal-select/meal-select';

// Providers
import { MealService } from '../../providers';

@Component({
  selector: 'page-meal-details',
  templateUrl: 'meal-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MealDetailsPage {
  public meal: Meal;
  public mealDetails: string = 'items';
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this.meal = <Meal>_params.get('meal');
    _detectorRef.markForCheck();
  }

  public addFoodItems(): void {
    let mealSelectModal: Modal = this._modalCtrl.create(MealSelectPage);
    mealSelectModal.present();
    mealSelectModal.onDidDismiss((items: Array<Food>) => {
      this.meal.foods.push(...items);
      this._detectorRef.markForCheck();
    });
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
