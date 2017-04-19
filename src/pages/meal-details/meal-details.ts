// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert, AlertController, Modal, ModalController, NavController, NavParams } from 'ionic-angular';

// Models
import { IFoodSearchResult, MealFoodItem, Meal } from '../../models';

// Pages
import { FoodSelectPage } from '../food-select/food-select';

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
    private _alertCtrl: AlertController,
    private _detectorRef: ChangeDetectorRef,
    private _mealSvc: MealService,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this.meal = <Meal>_params.get('meal');
    _detectorRef.markForCheck();
  }

  public addMealItems(): void {
    let mealSelectModal: Modal = this._modalCtrl.create(FoodSelectPage);
    mealSelectModal.present();
    mealSelectModal.onDidDismiss((items: Array<IFoodSearchResult>) => {
      this._mealSvc.serializeMealItems(items).subscribe((item: MealFoodItem) => {
        this.meal.mealItems.push(item);
        console.log(this.meal.mealItems);
        this._detectorRef.markForCheck();
      });
    });
  }

  public changeServings(item: MealFoodItem): void {
    let alert: Alert = this._alertCtrl.create({
      title: 'Servings',
      subTitle: item.name.toString(),
      inputs: [
        {
          name: 'servings',
          placeholder: 'Units',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Done',
          handler: data => {
            item.servings = +data.servings;
            this._detectorRef.markForCheck();
          }
        }
      ]
    });
    alert.present();
  }

  public removeItem(idx: number): void {
    this.meal.mealItems.splice(idx, 1);
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
