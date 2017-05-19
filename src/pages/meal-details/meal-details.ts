// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert, AlertController, Modal, ModalController, NavController, NavParams } from 'ionic-angular';

// Models
import { Food, Meal, MealPlan, Recipe } from '../../models';

// Pages
import { FoodSelectPage } from '../food-select/food-select';

// Providers
import { AlertService, MealService, NutritionService } from '../../providers';

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
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _mealSvc: MealService,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _nutritionSvc: NutritionService,
    private _params: NavParams
  ) {
    this.meal = <Meal>_params.get('meal');
    this.mealPlan = <MealPlan>_params.get('mealPlan');
    this.mealIdx = this.mealPlan.meals.indexOf(this.meal);
    this.meal.mealItems = this.meal.mealItems || [];
    console.log('Received meal: ', this.meal);
  }

  private _updateMealDetails(): void {
    this.meal.nutrition = this._nutritionSvc.getTotalNutrition(this.meal.mealItems);
    this.meal.pral = this._nutritionSvc.getPRAL(this.meal.nutrition);
    this.meal.quantity = this._nutritionSvc.calculateQuantity(this.meal.mealItems);

    this._mealSvc.checkMeal(this.meal);
    if (!this.meal.warnings.length) {
      this._alertSvc.showAlert('Keep up the good work!', 'A perfectly healthy meal!', 'Well done!');
    } else {
      this._alertSvc.showAlert('Please check the warnings', 'Something is wrong with this meal', 'Oh oh...');
    }
    this._detectorRef.detectChanges();
  }

  public addMealItems(): void {
    let mealSelectModal: Modal = this._modalCtrl.create(FoodSelectPage);
    mealSelectModal.present();
    mealSelectModal.onDidDismiss((selection: Food | Recipe) => {
      if (!!selection) {
        this.meal.mealItems.push(selection);
        console.log('My new foods: ', this.meal.mealItems);
        // Update the meal details
        this._updateMealDetails();
        this._detectorRef.detectChanges();
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
    this.meal.mealItems.splice(idx, 1);
    this._updateMealDetails();
  }

  public removeMeal(): void {
    this.mealPlan.meals.splice(this.mealIdx, 1);
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

  ionViewWillEnter(): void {
    this._detectorRef.detectChanges();
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
}
