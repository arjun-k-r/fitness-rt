// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert, AlertController, Modal, ModalController, NavController, NavParams } from 'ionic-angular';

// Models
import { IFoodSearchResult, MealFoodItem, Meal, MealWarning } from '../../models';

// Pages
import { FoodSelectPage } from '../food-select/food-select';

// Providers
import { AlertService, MealService } from '../../providers';

@Component({
  selector: 'page-meal-details',
  templateUrl: 'meal-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MealDetailsPage {
  public meal: Meal;
  public mealIdx: number;
  public mealDetails: string = 'items';
  constructor(
    private _alertCtrl: AlertController,
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _mealSvc: MealService,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this.mealIdx = <number>_params.get('mealIdx');
    this.meal = <Meal>_params.get('meal');
    _detectorRef.markForCheck();
  }

  public addMealItems(): void {
    let mealSelectModal: Modal = this._modalCtrl.create(FoodSelectPage);
    mealSelectModal.present();
    mealSelectModal.onDidDismiss((items: Array<IFoodSearchResult>) => {

      // Request Food report for each item
      this._mealSvc.serializeMealItems(items).subscribe((item: MealFoodItem) => {
        this.meal.mealItems.push(item);
        console.log(this.meal.mealItems);
        this._detectorRef.markForCheck();
      }, error => {
        console.log(error);
      }, () => {

        // Update meal nutrition and details
        this.meal.nutrition = this._mealSvc.getMealNutrition(this.meal.mealItems);
        this.meal.pral = this._mealSvc.getMealPral(this.meal.mealItems);
        this.meal.quantity = this._mealSvc.getMealSize(this.meal.mealItems);

        // Check the meal
        this._mealSvc.checkMeal(this.meal).then((isGood: boolean) => {
          this._alertSvc.showAlert('Keep up the good work!', 'You did a perfect food combination!', 'Well done!');
        }).catch((warnings: Array<MealWarning>) => {
          this.meal.warnings = [...warnings];
          console.log(this.meal);
          this._alertSvc.showAlert('Please check the warnings', 'Wrong food combinations', 'Oh oh...');
          this._detectorRef.markForCheck();
        });
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

  public saveMeal(): void {
    this._mealSvc.saveMeal(this.mealIdx, this.meal);
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
