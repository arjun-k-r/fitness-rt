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
  Loading,
  LoadingController,
  Modal,
  ModalController,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';

// Firebase
import * as firebase from 'firebase/app';

// Models
import { Food, Recipe } from '../../models';

// Providers
import { FOOD_GROUPS, FoodProvider, RecipeProvider } from '../../providers';

@IonicPage({
  name: 'food-list'
})
@Component({
  templateUrl: 'food-list.html'
})
export class FoodListPage {
  private _authId: string;
  private _foodLoader: Loading;
  private _foodSubscription: Subscription;
  private _nutrients: { key: string, name: string }[];
  private _recipeLoader: Loading;
  private _recipeSubscription: Subscription;
  private _usdaFoodLoader: Loading;
  private _usdaFoodSubscription: Subscription;
  public foodLimit: number = 50;
  public foods: Food[];
  public foodSearchQuery: string = '';
  public recipeLimit: number = 50;
  public recipes: Recipe[];
  public recipeSearchQuery: string = '';
  public selectedGroup: string = FOOD_GROUPS[0];
  public selectedItems: (Food | Recipe)[] = [];
  public selectedNutrient = '';
  public selectionSegment: string = 'foods';
  public usdaFoods: Food[];
  public usdaFoodLimit: number = 50;
  public usdaFoodSearchQuery: string = '';
  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _alertCtrl: AlertController,
    private _foodPvd: FoodProvider,
    private _loadCtrl: LoadingController,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _params: NavParams,
    private _recipePvd: RecipeProvider,
    private _viewCtrl: ViewController
  ) {
    this._authId = <string>this._params.get('authId');
    const food: Food = new Food();
    this._nutrients = Object.keys(food.nutrition).map((nutrientKey: string) => {
      return {
        key: nutrientKey,
        name: food.nutrition[nutrientKey].name
      }
    });
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
            this._usdaFoodLoader = this._loadCtrl.create({
              content: 'Loading...',
              spinner: 'crescent',
              duration: 10000
            });
            this._usdaFoodLoader.present();
          }
        }
      ]
    }).present();
  }

  public _selectItem(item: Food | Recipe, checkBox: HTMLInputElement, idx: number): void {
    if (idx === -1 || checkBox.checked === true) {
      this._alertCtrl.create({
        title: 'Servings',
        subTitle: `${item.name.toString()}`,
        inputs: [
          {
            name: 'servings',
            placeholder: item.hasOwnProperty('chef') ? `Servings x ${item.quantity.toString()} g` : 'Servings x 100g',
            type: 'number',
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              checkBox.checked = false;
              if (idx !== -1) {
                this.selectedItems = [...this.selectedItems.slice(0, idx), ...this.selectedItems.slice(idx + 1)];
              }
            }
          },
          {
            text: 'Done',
            handler: (data: { servings: number }) => {
              item.servings = data.servings;
              if (idx === -1) {
                this.selectedItems = [...this.selectedItems, item];
              } else {
                this.selectedItems = [...this.selectedItems.slice(0, idx), item, ...this.selectedItems.slice(idx + 1)];
              }
            }
          }
        ]
      }).present();
    } else if (checkBox.checked === false) {
      this.selectedItems = [...this.selectedItems.slice(0, idx), ...this.selectedItems.slice(idx + 1)];
    }
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
    const newFood: Food = new Food();
    this._modalCtrl.create('food-details', { authId: this._authId, food: newFood, id: newFood.name }).present();
  }

  public clearSearchFoods(evenet: string): void {
    this.foodSearchQuery = '';
  }

  public clearSearchRecipes(evenet: string): void {
    this.recipeSearchQuery = '';
  }

  public clearSearchUsdaFoods(evenet: string): void {
    this.foodSearchQuery = '';
  }

  public doneSelecting(): void {
    this._viewCtrl.dismiss(this.selectedItems);
  }

  public loadMoreFoods(ev: InfiniteScroll) {
    this.foodLimit += 50;
    setTimeout(() => ev.complete(), 1000);
  }

  public loadMoreRecipes(ev: InfiniteScroll) {
    this.recipeLimit += 50;
    setTimeout(() => ev.complete(), 1000);
  }

  public loadMoreUsdaFoods(ev: InfiniteScroll) {
    this.usdaFoodLimit += 50;
    setTimeout(() => ev.complete(), 1000);
  }

  public loadRecipes(): void {
    if (!this._recipeSubscription) {
      this._recipeLoader = this._loadCtrl.create({
        content: 'Loading...',
        duration: 10000,
        spinner: 'crescent'
      });
      this._recipeLoader.present();
      this._recipeSubscription = this._recipePvd.getRecipes$(this._authId).subscribe((recipes: Recipe[]) => {
        this.recipes = [...recipes];
        if (this._recipeLoader) {
          this._recipeLoader.dismiss();
          this._recipeLoader = null;
        }
      }, (err: firebase.FirebaseError) => {
        if (this._recipeLoader) {
          this._recipeLoader.dismiss();
          this._recipeLoader = null;
        }
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.message,
          buttons: ['OK']
        }).present();
      });
    }
  }

  public loadUsdaFoods(): void {
    if (!this._usdaFoodSubscription) {
      this._usdaFoodLoader = this._loadCtrl.create({
        content: 'Loading...',
        duration: 10000,
        spinner: 'crescent'
      });
      this._usdaFoodLoader.present();
      this._usdaFoodSubscription = this._foodPvd.getUsdaFoods$(this.selectedGroup).subscribe((foods: Food[]) => {
        this.usdaFoods = [...foods];
        if (this._usdaFoodLoader) {
          this._usdaFoodLoader.dismiss();
          this._usdaFoodLoader = null;
        }
      }, (err: firebase.FirebaseError) => {
        if (this._usdaFoodLoader) {
          this._usdaFoodLoader.dismiss();
          this._usdaFoodLoader = null;
        }
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.message,
          buttons: ['OK']
        }).present();
      });
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

  public showOptions(item: Food | Recipe, checkBox: HTMLInputElement): void {
    const idx: number = this.selectedItems.indexOf(item);
    if (idx !== -1) {
      checkBox.checked = true;
    }
    this._actionSheetCtrl.create({
      title: 'What to do with this item?',
      buttons: [
        {
          text: 'View details',
          handler: () => {
            if (idx === -1) {
              checkBox.checked = false;
            }
            if (item.hasOwnProperty('chef')) {
              this._navCtrl.push('recipe-details', { recipe: item });
            } else {
              const foodDetailsModal: Modal = this._modalCtrl.create('food-details', { authId: this._authId, food: item, id: item.name });
              foodDetailsModal.present();
            }
          }
        }, {
          text: idx === -1 ? 'Select it' : 'Change servings',
          handler: () => {
            this._selectItem(item, checkBox, idx);
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
    this._foodLoader = this._loadCtrl.create({
      content: 'Loading...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._foodLoader.present();
    this._foodSubscription = this._foodPvd.getMyFoods$(this._authId).subscribe((foods: Food[]) => {
      this.foods = [...foods];
      if (this._foodLoader) {
        this._foodLoader.dismiss();
        this._foodLoader = null;
      }
    }, (err: firebase.FirebaseError) => {
      if (this._foodLoader) {
        this._foodLoader.dismiss();
        this._foodLoader = null;
      }
      this._alertCtrl.create({
        title: 'Uhh ohh...',
        subTitle: 'Something went wrong',
        message: err.message,
        buttons: ['OK']
      }).present();
    });
  }

  ionViewWillLeave(): void {
    this._foodSubscription && this._foodSubscription.unsubscribe();
    this._recipeSubscription && this._recipeSubscription.unsubscribe();
    this._usdaFoodSubscription && this._usdaFoodSubscription.unsubscribe();
    if (this._foodLoader) {
      this._foodLoader.dismiss();
      this._foodLoader = null;
    }
    if (this._recipeLoader) {
      this._recipeLoader.dismiss();
      this._recipeLoader = null;
    }
    if (this._usdaFoodLoader) {
      this._usdaFoodLoader.dismiss();
      this._usdaFoodLoader = null;
    }
  }
}