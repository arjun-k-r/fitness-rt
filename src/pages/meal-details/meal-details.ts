// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Modal, ModalController, NavController, NavParams } from 'ionic-angular';

// Models
import { Meal } from '../../models';

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
  public mealSelectModal: Modal;
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this.meal = <Meal>_params.get('meal');
    this.mealSelectModal = this._modalCtrl.create(MealSelectPage);

    _detectorRef.markForCheck();
  }

  public addFoodItems(): void {
    this.mealSelectModal.present();
    this.mealSelectModal.onDidDismiss((data: Array<Meal>) => {
      console.log(data);
    })
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
