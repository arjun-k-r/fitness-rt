// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert, AlertController, Modal, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';

// Models
import { Food, Meal, MealPlan, Recipe } from '../../models';

// Pages
import { FoodSelectPage } from '../food-select/food-select';

// Providers
import { MealService, NutritionService } from '../../providers';

@Component({
  selector: 'page-meal-details',
  templateUrl: 'meal-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MealDetailsPage {
  public meal: Meal;
  public mealIdx: number;
  public mealDetails: string = 'details';
  public mealPlan: MealPlan;
  constructor(
    private _alertCtrl: AlertController,
    private _detectorRef: ChangeDetectorRef,
    private _mealSvc: MealService,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _nutritionSvc: NutritionService,
    private _params: NavParams,
    private _toastCtrl: ToastController
  ) {
    this.meal = <Meal>_params.get('meal');
    this.mealPlan = <MealPlan>_params.get('mealPlan');
    this.mealIdx = this.mealPlan.meals.indexOf(this.meal);
    this.meal.mealItems = this.meal.mealItems || [];
    console.log('Received meal: ', this.meal);
  }

  private _updateMealDetails(): void {
    this.meal.nutrition = Object.assign({}, this._nutritionSvc.getTotalNutrition(this.meal.mealItems));
    this.meal.pral = this._nutritionSvc.getPRAL(this.meal.nutrition);
    this.meal.quantity = this._nutritionSvc.calculateQuantity(this.meal.mealItems);

    this._mealSvc.checkMeal(this.meal);
    if (!this.meal.warnings.length) {
      this._toastCtrl.create({
        message: 'Bravo! A perfect meal',
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Cancel'
      }).present();
    } else {
      this._toastCtrl.create({
        message: 'There are some warnings for this meal!',
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Cancel'
      }).present();
    }
  }

  public addMealItems(): void {
    let mealSelectModal: Modal = this._modalCtrl.create(FoodSelectPage);
    mealSelectModal.present();
    mealSelectModal.onDidDismiss((selection: Food | Recipe) => {
      if (!!selection) {
        this.meal.mealItems = [...this.meal.mealItems, selection];
        console.log('My new foods: ', this.meal.mealItems);
        // Update the meal details
        this._updateMealDetails();
      }
    })
  }

  public changeServings(item: Food): void {
    let alert: Alert = this._alertCtrl.create({
      title: 'Servings',
      subTitle: `${item.name.toString()} (${item.quantity.toString()}${item.unit.toString()})`,
      inputs: [
        {
          name: 'servings',
          placeholder: `Servings x ${item.quantity.toString()}${item.unit.toString()}`,
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
            this._updateMealDetails();
            this._detectorRef.detectChanges();
          }
        }
      ]
    });
    alert.present();
  }

  public removeItem(idx: number): void {
    this.meal.mealItems = [...this.meal.mealItems.slice(0, idx), ...this.meal.mealItems.slice(idx + 1)];
    this._updateMealDetails();
  }

  public removeMeal(): void {
    this.mealPlan.meals = [...this.mealPlan.meals.slice(0, this.mealIdx), ...this.mealPlan.meals.slice(this.mealIdx + 1)];
    this._mealSvc.saveMealPlan(this.mealPlan);
    this._navCtrl.pop();
  }

  public saveMeal(): void {
    this._updateMealDetails();
    this._mealSvc.saveMeal(this.meal, this.mealPlan);
  }

  public segmentChange(): void {
    this._detectorRef.detectChanges();
  }

  ionViewCanLeave(): Promise<boolean> {
    return new Promise((resolve, reject) => this._alertCtrl.create({
      title: 'Before eating',
      subTitle: 'Please make sure you check each item',
      inputs: [
        {
          type: 'checkbox',
          label: 'Eat slowly and chew until fluid',
          value: 'chewing'
        }, {
          type: 'checkbox',
          label: 'Be grateful for your meal and enjoy each bite',
          value: 'gratitude'
        }, {
          type: 'checkbox',
          label: 'Make sure you are truly hungry, not just bored or tired',
          value: 'hunger'
        }, {
          type: 'checkbox',
          label: 'Serve your meal peacefully',
          value: 'silence'
        }
      ],
      buttons: [
        {
          text: 'Done',
          handler: () => {
            resolve(true);
          }
        }
      ]
    }));
  }

  ionViewWillEnter(): void {
    this._detectorRef.detectChanges();
  }

  ionViewWillLeave(): void {
    this._detectorRef.detach();
  }
}
