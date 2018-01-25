// App
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  InfiniteScroll,
  ModalController,
  NavParams,
  ViewController
} from 'ionic-angular';

// Firebase
import { FirebaseError } from 'firebase/app';

// Models
import { Food, Meal, NutritionalValues } from '../../models';

// Providers
import { DietProvider, FOOD_GROUPS, FoodProvider, NotificationProvider } from '../../providers';

@IonicPage({
  name: 'food-list'
})
@Component({
  templateUrl: 'food-list.html'
})
export class FoodListPage {
  private _authId: string;
  private _foodSubscription: Subscription;
  private _nutrients: { key: string, name: string }[];
  private _mealSubscription: Subscription;
  private _usdaFoodSubscription: Subscription;
  public foodLimit: number = 50;
  public foods: Food[];
  public foodPageSegmet: string = 'foods';
  public foodSearchQuery: string = '';
  public mealLimit: number = 50;
  public meals: Meal[];
  public mealSearchQuery: string = '';
  public selectedFoods: (Food | Meal)[] = [];
  public selectedGroup: string = FOOD_GROUPS[0];
  public selectedNutrient = '';
  public usdaFoods: Food[];
  public usdaFoodLimit: number = 50;
  public usdaFoodSearchQuery: string = '';
  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _alertCtrl: AlertController,
    private _dietPvd: DietProvider,
    private _foodPvd: FoodProvider,
    private _modalCtrl: ModalController,
    private _notifyPvd: NotificationProvider,
    private _params: NavParams,
    private _viewCtrl: ViewController
  ) {
    this._authId = <string>this._params.get('authId');
    const food: Food = new Food('', '', '', new NutritionalValues(), 0, '');
    this._nutrients = Object.keys(food.nourishment).map((nutrientKey: string) => {
      return {
        key: nutrientKey,
        name: food.nourishment[nutrientKey].name
      }
    });
  }

  private _selectFood(food: Food | Meal, checkBox: HTMLInputElement, idx: number): void {
    if (idx === -1 || checkBox.checked === true) {
      this._alertCtrl.create({
        title: 'Quantity',
        subTitle: `How much ${food.name} do you want to eat?`,
        inputs: [
          {
            name: 'quantity',
            placeholder: `${food.quantity.toString()} g`,
            type: 'number'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              checkBox.checked = false;
              if (idx !== -1) {
                this.selectedFoods = [...this.selectedFoods.slice(0, idx), ...this.selectedFoods.slice(idx + 1)];
              }
            }
          },
          {
            text: 'Done',
            handler: (data: { quantity: number }) => {
              food.quantity = +data.quantity;
              if (idx === -1) {
                this.selectedFoods = [...this.selectedFoods, food];
              } else {
                this.selectedFoods = [...this.selectedFoods.slice(0, idx), food, ...this.selectedFoods.slice(idx + 1)];
              }
            }
          }
        ]
      }).present();
    } else if (checkBox.checked === false) {
      this.selectedFoods = [...this.selectedFoods.slice(0, idx), ...this.selectedFoods.slice(idx + 1)];
    }
  }

  private _selectGroup(): void {
    this._alertCtrl.create({
      title: 'Filter foods by group',
      subTitle: 'Select a food group',
      inputs: [...FOOD_GROUPS.map((group: string) => {
        return {
          type: 'radio',
          label: group,
          value: group,
          checked: this.selectedGroup === group
        }
      })],
      buttons: [
        {
          text: 'Done',
          handler: (data: string) => {
            this.selectedGroup = data;
            this.selectedNutrient = '';
            this._foodPvd.changeFoodGroup(this.selectedGroup);
            this._notifyPvd.showLoading();
          }
        }
      ]
    }).present();
  }

  private _selectNutrient(): void {
    this._alertCtrl.create({
      title: 'Filter foods by nutrients',
      subTitle: 'Select a nutrient',
      inputs: [...this._nutrients.map((nutrient: { key: string, name: string }) => {
        return {
          type: 'radio',
          label: nutrient.name,
          value: nutrient.key,
          checked: this.selectedNutrient === `nutrition.${nutrient.key}.value`
        }
      })],
      buttons: [
        {
          text: 'Done',
          handler: (data: string) => {
            this.selectedNutrient = `nutrition.${data}.value`;
          }
        }
      ]
    }).present();
  }

  public addFood(): void {
    const newFood: Food = new Food('', '', '', new NutritionalValues(), 0, '');
    this._modalCtrl.create('food-details', { authId: this._authId, food: newFood, id: newFood.name }).present();
  }

  public clearSearchFoods(evenet: string): void {
    this.foodSearchQuery = '';
  }

  public clearSearchMeals(evenet: string): void {
    this.mealSearchQuery = '';
  }

  public clearSearchUsdaFoods(evenet: string): void {
    this.foodSearchQuery = '';
  }

  public doneSelecting(): void {
    this._viewCtrl.dismiss(this.selectedFoods);
  }

  public getFoods(): void {
    if (!this._foodSubscription || (this._foodSubscription && this._foodSubscription.closed)) {
      this._notifyPvd.showLoading();
      this._foodSubscription = this._foodPvd.getMyFoods$(this._authId, this.selectedGroup).subscribe((foods: Food[]) => {
        this.foods = [...foods];
        this._notifyPvd.closeLoading()
      }, (err: FirebaseError) => {
        this._notifyPvd.closeLoading()
        this._notifyPvd.showError(err.message);
      });
    }
  }

  public getMeals(): void {
    if (!this._mealSubscription || (this._mealSubscription && this._mealSubscription.closed)) {
      this._notifyPvd.showLoading();
      this._mealSubscription = this._dietPvd.getFavoriteMeals$(this._authId).subscribe((meals: Meal[]) => {
        this.meals = [...meals];
        this._notifyPvd.closeLoading()
      }, (err: FirebaseError) => {
        this._notifyPvd.closeLoading()
        this._notifyPvd.showError(err.message);
      });
    }
  }

  public getUSDAFoods(): void {
    if (!this._usdaFoodSubscription || (this._usdaFoodSubscription && this._usdaFoodSubscription.closed)) {
      this._notifyPvd.showLoading();
      this._usdaFoodSubscription = this._foodPvd.getUSDAFoods$(this.selectedGroup).subscribe((foods: Food[]) => {
        this.usdaFoods = [...foods];
        this._notifyPvd.closeLoading()
      }, (err: FirebaseError) => {
        this._notifyPvd.closeLoading()
        this._notifyPvd.showError(err.message);
      });
    }
  }

  public loadMoreFoods(ev: InfiniteScroll) {
    this.foodLimit += 50;
    setTimeout(() => ev.complete(), 1000);
  }

  public loadMoreMeals(ev: InfiniteScroll) {
    this.mealLimit += 50;
    setTimeout(() => ev.complete(), 1000);
  }

  public loadMoreUsdaFoods(ev: InfiniteScroll) {
    this.usdaFoodLimit += 50;
    setTimeout(() => ev.complete(), 1000);
  }

  public selectMeal(meal: Meal): void {
    const idx: number = this.selectedFoods.indexOf(meal);
    if (idx === -1) {
      this.selectedFoods = [...this.selectedFoods, meal];
    } else {
      this.selectedFoods = [...this.selectedFoods.slice(0, idx), ...this.selectedFoods.slice(idx + 1)];
    }
  }

  public showFilter(): void {
    this._actionSheetCtrl.create({
      title: 'Food list options',
      buttons: [
        {
          text: 'Filter by food group',
          handler: () => {
            this._selectGroup();
          }
        }, {
          text: 'Sort by nutrients',
          handler: () => {
            this._selectNutrient();
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();
  }

  public showOptions(food: Food, checkBox: HTMLInputElement): void {
    const idx: number = this.selectedFoods.indexOf(food);
    if (idx !== -1) {
      checkBox.checked = true;
    }
    this._actionSheetCtrl.create({
      title: 'What to do with this food?',
      buttons: [
        {
          text: 'View details',
          handler: () => {
            if (idx === -1) {
              checkBox.checked = false;
            }
            this._modalCtrl.create('food-details', { authId: this._authId, food: food, id: food.name }).present();
          }
        }, {
          text: idx === -1 ? 'Select it' : 'Change servings',
          handler: () => {
            this._selectFood(food, checkBox, idx);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            if (idx === -1) {
              checkBox.checked = false;
            }
          }
        }
      ]
    }).present();
  }

  ionViewWillEnter(): void {
    this.getFoods();
  }

  ionViewWillLeave(): void {
    this._foodSubscription.unsubscribe();
    this._mealSubscription && this._mealSubscription.unsubscribe();
    this._usdaFoodSubscription && this._usdaFoodSubscription.unsubscribe();
  }
}