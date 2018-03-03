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
  private authId: string;
  private foodSubscription: Subscription;
  private nutrients: { key: string, name: string }[];
  private mealSubscription: Subscription;
  private usdaFoodSubscription: Subscription;
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
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private dietPvd: DietProvider,
    private foodPvd: FoodProvider,
    private modalCtrl: ModalController,
    private notifyPvd: NotificationProvider,
    private params: NavParams,
    private viewCtrl: ViewController
  ) {
    this.authId = <string>this.params.get('authId');
    const food: Food = new Food('', '', '', new NutritionalValues(), 0, '');
    this.nutrients = Object.keys(food.nourishment).map((nutrientKey: string) => {
      return {
        key: nutrientKey,
        name: food.nourishment[nutrientKey].name
      }
    });
  }

  private selectFood(food: Food | Meal, checkBox: HTMLInputElement, idx: number): void {
    if (idx === -1 || checkBox.checked === true) {
      this.alertCtrl.create({
        title: 'Quantity',
        subTitle: `How much ${food.name} do you want to eat?`,
        inputs: [
          {
            name: 'quantity',
            placeholder: `${food.quantity.toString()}`,
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

  private selectGroup(): void {
    this.alertCtrl.create({
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
            this.clearSearchUsdaFoods();
            this.foodPvd.changeFoodGroup(this.selectedGroup);
            this.notifyPvd.showLoading();
          }
        }
      ]
    }).present();
  }

  private selectNutrient(): void {
    this.alertCtrl.create({
      title: 'Filter foods by nutrients',
      subTitle: 'Select a nutrient',
      inputs: [...this.nutrients.map((nutrient: { key: string, name: string }) => {
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
    this.modalCtrl.create('food-details', { authId: this.authId, food: newFood, id: newFood.name }).present();
  }

  public clearSearchFoods(): void {
    this.foodSearchQuery = '';
  }

  public clearSearchMeals(): void {
    this.mealSearchQuery = '';
  }

  public clearSearchUsdaFoods(): void {
    this.usdaFoodSearchQuery = '';
  }

  public dismiss(): void {
    this.viewCtrl.dismiss();
  }

  public doneSelecting(): void {
    this.viewCtrl.dismiss(this.selectedFoods);
  }

  public getFoods(): void {
    if (!this.foodSubscription || (this.foodSubscription && this.foodSubscription.closed)) {
      this.notifyPvd.showLoading();
      this.foodSubscription = this.foodPvd.getMyFoods$(this.authId, this.selectedGroup).subscribe((foods: Food[]) => {
        this.foods = [...foods];
        this.notifyPvd.closeLoading()
      }, (err: FirebaseError) => {
        this.notifyPvd.closeLoading()
        this.notifyPvd.showError(err.message);
      });
    }
  }

  public getMeals(): void {
    if (!this.mealSubscription || (this.mealSubscription && this.mealSubscription.closed)) {
      this.notifyPvd.showLoading();
      this.mealSubscription = this.dietPvd.getFavoriteMeals$(this.authId).subscribe((meals: Meal[]) => {
        this.meals = [...meals];
        this.notifyPvd.closeLoading()
      }, (err: FirebaseError) => {
        this.notifyPvd.closeLoading()
        this.notifyPvd.showError(err.message);
      });
    }
  }

  public getUSDAFoods(): void {
    if (!this.usdaFoodSubscription || (this.usdaFoodSubscription && this.usdaFoodSubscription.closed)) {
      this.notifyPvd.showLoading();
      this.usdaFoodSubscription = this.foodPvd.getUSDAFoods$(this.selectedGroup).subscribe((foods: Food[]) => {
        this.usdaFoods = [...foods];
        this.notifyPvd.closeLoading()
      }, (err: FirebaseError) => {
        this.notifyPvd.closeLoading()
        this.notifyPvd.showError(err.message);
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

  public selectMeal(meal: Meal, checkBox: HTMLInputElement): void {
    const idx: number = this.selectedFoods.indexOf(meal);
    if (idx === -1 || !!checkBox.checked) {
      this.alertCtrl.create({
        title: 'Servings',
        subTitle: `How much ${meal.name} do you want to eat?`,
        inputs: [
          {
            name: 'servings',
            type: 'number'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              if (idx === -1) {
                checkBox.checked = false;
              }
            }
          },
          {
            text: 'Done',
            handler: (data: { servings: number }) => {
              meal.servings = +data.servings;
              if (idx === -1) {
                this.selectedFoods = [...this.selectedFoods, meal];
              } else {
                this.selectedFoods = [...this.selectedFoods.slice(0, idx), meal, ...this.selectedFoods.slice(idx + 1)];
              }
            }
          }
        ]
      }).present();
    } else {
      this.selectedFoods = [...this.selectedFoods.slice(0, idx), ...this.selectedFoods.slice(idx + 1)];
    }
  }

  public showFilter(): void {
    this.actionSheetCtrl.create({
      title: 'Food list options',
      buttons: [
        {
          text: 'Filter by food group',
          handler: () => {
            this.selectGroup();
          }
        }, {
          text: 'Sort by nutrients',
          handler: () => {
            this.selectNutrient();
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
    this.actionSheetCtrl.create({
      title: 'What to do with this food?',
      buttons: [
        {
          text: 'View details',
          handler: () => {
            if (idx === -1) {
              checkBox.checked = false;
            }
            this.modalCtrl.create('food-details', { authId: this.authId, food: food, id: food.name }).present();
          }
        }, {
          text: idx === -1 ? 'Select it' : 'Change servings',
          handler: () => {
            this.selectFood(food, checkBox, idx);
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
    this.foodSubscription.unsubscribe();
    this.mealSubscription && this.mealSubscription.unsubscribe();
    this.usdaFoodSubscription && this.usdaFoodSubscription.unsubscribe();
  }
}