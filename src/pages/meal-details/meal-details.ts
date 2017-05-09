// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert, AlertController, Modal, ModalController, NavController, NavParams } from 'ionic-angular';

// Models
import { Food, IFoodSearchResult, MEAL_TYPES, Meal, MealPlan, Recipe, WarningMessage } from '../../models';

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
  public mealDetails: string = 'details';
  public mealPlan: MealPlan;
  public mealTypes: Array<string> = [...MEAL_TYPES];
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
    this.mealPlan = <MealPlan>_params.get('mealPlan');
    this.meal = this.mealPlan.meals[this.mealIdx];
    console.log('Received meal: ', this.meal);
  }

  /**
   * Update the meal whenever changes occur
   * @returns {void}
   */
  private _updateMealDetails(): void {
    this.meal.nutrition = this._mealSvc.getMealNutrition(this.meal.mealItems);
    this.meal.pral = this._mealSvc.getMealPral(this.meal.mealItems);
    this.meal.quantity = this._mealSvc.getMealSize(this.meal.mealItems);

    this._mealSvc.checkMeal(this.mealIdx, this.mealPlan.meals).then((isGood: boolean) => {
      this._alertSvc.showAlert('Keep up the good work!', 'A perfectly healthy meal!', 'Well done!');
    }).catch((warnings: Array<WarningMessage>) => {
      if (!!warnings.length) {
        this.meal.warnings = [...warnings];
        console.log(this.meal);
        this._alertSvc.showAlert('Please check the warnings', 'Something is wrong with this meal', 'Oh oh...');
        this._detectorRef.markForCheck();
      }
    });
  }

  /**
   * Updates the food quantity and nutrients to the new serving size and calls meal update method afterwards
   * @param {Food} foodItem - The food to update
   * @returns {void}
   */
  private _changeItemQuantity(foodItem: Food): void {
    this._mealSvc.changeQuantities(foodItem);
    this._updateMealDetails();
  }

  /**
   * Adds new foods to the meal
   * @returns {void}
   */
  public addMealItems(): void {
    let mealSelectModal: Modal = this._modalCtrl.create(FoodSelectPage);
    mealSelectModal.present();
    mealSelectModal.onDidDismiss((selections: { foods: Array<IFoodSearchResult>, recipes: Array<Recipe> }) => {

      // Request Food report for each item
      this._mealSvc.serializeMealItems(selections.foods).then((items: Array<Food>) => {
        this.meal.mealItems.push(...items);
        this.meal.mealItems.push(...selections.recipes)
        console.log(this.meal.mealItems);
        // Update the meal details
        this._updateMealDetails();
        this._detectorRef.markForCheck();
      }, error => {
        console.log(error);
      });
    });
  }

  /**
   * Shows a a modal dialog to change the number of servings of a food
   * @description A single serving is 100g. A meal may contain more than 100g of a food
   * @param {Food} item - The food the change servings
   * @returns {void}
   */
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
            this._changeItemQuantity(item);
            this._detectorRef.markForCheck();
          }
        }
      ]
    });
    alert.present();
  }

  public checkMealTime(): void {
    let warning: WarningMessage = this._mealSvc.checkMealHour(this.mealIdx, this.mealPlan.meals);
    if (!warning) {
      this._alertSvc.showAlert('Keep up the good work!', 'A perfect meal timing!', 'Well done!');
    } else {
      this._alertSvc.showAlert(warning.message, warning.moreInfo, 'Oh oh...');
    }
  }

  /**
   * Removes food from the meal and calls meal update method afterwards
   * @param idx - The index of the food to remove
   * @returns {void}
   */
  public removeItem(idx: number): void {
    this.meal.mealItems.splice(idx, 1);
    this._updateMealDetails();
  }

  /**
   * Removes the meal from the database
   * @returns {void}
   */
  public removeMeal(): void {
    this.mealPlan.meals.splice(this.mealIdx, 1);
    this._mealSvc.saveMeal(this.meal, this.mealIdx, this.mealPlan);
    this._navCtrl.pop();
  }

  /**
   * Saves the meal to the database
   * @returns {void}
   */
  public saveMeal(): void {
    this._mealSvc.saveMeal(this.meal, this.mealIdx, this.mealPlan);
  }

  public segmentChange(): void {
    this._detectorRef.markForCheck();
  }

  ionViewWillEnter(): void {
    this._detectorRef.detectChanges();
    this._detectorRef.markForCheck();
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
}
