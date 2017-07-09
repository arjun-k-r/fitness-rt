// App
import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPageMetadata, InfiniteScroll, Loading, LoadingController, NavController, ViewController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

// Models
import { Food, Recipe } from '../../models';

// Pages
import { FoodDetailsPage } from '../food-details/food-details';

// Providers
import { FOOD_GROUPS, FoodService, RecipeService } from '../../providers';

@Component({
  selector: 'page-food-select',
  templateUrl: 'food-select.html'
})
export class FoodSelectPage {
  private _dismissedFoodLoader: boolean = false;
  private _dismissedRecipeLoader: boolean = false;
  private _foodLoader: Loading;
  private _foodSubscription: Subscription;
  private _nutrients: Array<{ key: string, name: string }>;
  private _recipeLoader: Loading;
  private _recipeSubscription: Subscription;
  public detailsPage: IonicPageMetadata = FoodDetailsPage;
  public foods: Array<Food>;
  public foodLimit: number = 50;
  public recipeLimit: number = 50;
  public recipes: Array<Recipe>;
  public searchQueryFoods: string = '';
  public searchQueryRecipes: string = '';
  public selectedGroup: string = FOOD_GROUPS[0];
  public selectedItems: Array<Food | Recipe> = [];
  public selectedNutrient = '';
  public selectionSegment: string = 'foods';
  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _alertCtrl: AlertController,
    private _foodSvc: FoodService,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _recipeSvc: RecipeService,
    private _viewCtrl: ViewController
  ) {
    let food: Food = new Food();
    this._nutrients = Object.keys(food.nutrition).map((nutrientKey: string) => {
      return {
        key: nutrientKey,
        name: food.nutrition[nutrientKey].name
      }
    })
  }

  private _selectGroup(): void {
    this._alertCtrl.create({
      title: 'Filter by groups',
      subTitle: 'Pick a food group',
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
            this._dismissedFoodLoader = false;
            this._foodSvc.changeFoodGroup(this.selectedGroup);
            this._foodLoader = this._loadCtrl.create({
              content: 'Loading...',
              spinner: 'crescent'
            });
            this._foodLoader.present();
            setTimeout(() => {
              if (!this._dismissedFoodLoader) {
                this._foodLoader.dismiss();
              }
            }, 30000);
          }
        }
      ]
    }).present();
  }

  public _selectItem(item: Food | Recipe, checkBox: HTMLInputElement): void {
    let idx: number = this.selectedItems.indexOf(item);
    if (idx === -1) {
      this._alertCtrl.create({
        title: 'Servings',
        subTitle: `${item.name.toString()}`,
        inputs: [
          {
            name: 'servings',
            placeholder: item.hasOwnProperty('chef') ? `Servings x ${item['quantity'].toString()}${item['unit'].toString()}` : 'Servings x 100g',
            type: 'number',
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              checkBox.checked = false;
            }
          },
          {
            text: 'Done',
            handler: (data: { servings: number }) => {
              item.servings = data.servings;
              this.selectedItems = [...this.selectedItems, item];
            }
          }
        ]
      }).present();
    } else {
      this.selectedItems = [...this.selectedItems.slice(0, idx), ...this.selectedItems.slice(idx + 1)];
    }
  }

  private _selectNutrient(): void {
    this._alertCtrl.create({
      title: 'Filter by nutrients',
      subTitle: 'Pick a nutrient',
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

  public clearSearchFoods(ev: string): void {
    this.searchQueryFoods = '';
  }

  public clearSearchRecipes(ev: string): void {
    this.searchQueryRecipes = '';
  }

  public doneSelecting(): void {
    this._viewCtrl.dismiss(this.selectedItems);
  }

  public loadMoreFoods(ev: InfiniteScroll) {
    this.foodLimit += 50;
    setTimeout(() => {
      ev.complete();
    }, 1000);
  }

  public loadMoreRecipes(ev: InfiniteScroll) {
    this.recipeLimit += 50;
    setTimeout(() => {
      ev.complete();
    }, 1000);
  }

  public loadRecipes(): void {
    if (!this._recipeSubscription) {
      this._recipeLoader = this._loadCtrl.create({
        content: 'Loading...',
        spinner: 'crescent'
      });
      this._recipeLoader.present();
      setTimeout(() => {
        if (!this._dismissedRecipeLoader) {
          this._recipeLoader.dismiss();
        }
      }, 30000);
      this._recipeSubscription = this._recipeSvc.getRecipes$().subscribe((data: Array<Recipe>) => {
        this.recipes = [...data];
        if (!this._dismissedRecipeLoader) {
          this._recipeLoader.dismiss();
          this._dismissedRecipeLoader = true;
        }
      }, (err: { status: string, message: string }) => {
        if (!this._dismissedRecipeLoader) {
          this._recipeLoader.dismiss();
          this._dismissedRecipeLoader = true;
        }
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: `Error ${err.status}! ${err.message}`,
          buttons: ['OK']
        }).present();
      });
      this._recipeLoader.onDidDismiss(() => this._dismissedRecipeLoader = true);
    }
  }

  public showFilter(): void {
    this._actionSheetCtrl.create({
      title: 'Change ingredient',
      buttons: [
        {
          text: 'Change food group',
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
    this._actionSheetCtrl.create({
      title: 'What to do with this food?',
      buttons: [
        {
          text: 'View details',
          handler: () => {
            checkBox.checked = false;
            if (item.hasOwnProperty('ndbno')) {
              this._navCtrl.push(FoodDetailsPage, { food: item })
            }
          }
        }, {
          text: 'Select it',
          handler: () => {
            this._selectItem(item, checkBox);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            checkBox.checked = false
          }
        }
      ]
    }).present();
  }

  ionViewWillLoad(): void {
    this._foodLoader = this._loadCtrl.create({
      content: 'Loading...',
      spinner: 'crescent'
    });
    this._foodLoader.present();
    setTimeout(() => {
      if (!this._dismissedFoodLoader) {
        this._foodLoader.dismiss();
      }
    }, 30000);
    this._foodSubscription = this._foodSvc.getFoods$(this.selectedGroup).subscribe((data: Array<Food>) => {
      this.foods = [...data];
      if (!this._dismissedFoodLoader) {
        this._foodLoader.dismiss();
        this._dismissedFoodLoader = true;
      }
    }, (err: { status: string, message: string }) => {
      if (!this._dismissedFoodLoader) {
        this._foodLoader.dismiss();
        this._dismissedFoodLoader = true;
      }
      this._alertCtrl.create({
        title: 'Uhh ohh...',
        subTitle: 'Something went wrong',
        message: `Error ${err.status}! ${err.message}`,
        buttons: ['OK']
      }).present();
    });
    this._foodLoader.onDidDismiss(() => this._dismissedFoodLoader = true);
  }

  ionViewWillLeave(): void {
    this._foodSubscription.unsubscribe();
    if (this._recipeSubscription) {
      this._recipeSubscription.unsubscribe();
    }
  }
}