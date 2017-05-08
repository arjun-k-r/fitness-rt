// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertController, InfiniteScroll, Loading, LoadingController, ViewController } from 'ionic-angular';

// Third-party
import { FirebaseListObservable } from 'angularfire2';

// Models
import { IFoodSearchResult, FoodGroup, Recipe } from '../../models';

// Providers
import { FOOD_GROUPS, FoodDataService, RecipeService } from '../../providers';

@Component({
  selector: 'page-food-select',
  templateUrl: 'food-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodSelectPage {
  public foods: Array<IFoodSearchResult>;
  public foodLimit: number = 50;
  public groups: Array<FoodGroup> = [...FOOD_GROUPS];
  public recipeLimit: number = 50;
  public recipes$: FirebaseListObservable<Array<Recipe>>;
  public searchQueryFoods: string = '';
  public searchQueryRecipes: string = '';
  public selectedGroup: FoodGroup = this.groups[0];
  public selectedFoods: Array<IFoodSearchResult> = [];
  public selectedRecipes: Array<Recipe> = [];
  public selectionSegment: string = 'foods';
  public start: number;
  constructor(
    private _alertCtrl: AlertController,
    private _detectorRef: ChangeDetectorRef,
    private _foodDataSvc: FoodDataService,
    private _loadCtrl: LoadingController,
    private _recipeSvc: RecipeService,
    private _viewCtrl: ViewController
  ) { }

  public clearSearchFoods(ev: string): void {
    this.searchQueryFoods = '';
    this.refreshItems();
  }

  public clearSearchRecipes(ev: string): void {
    this.searchQueryRecipes = '';
    this._detectorRef.markForCheck();
  }

  public doneSelecting(): void {
    this._viewCtrl.dismiss({ foods: this.selectedFoods, recipes: this.selectedRecipes });
  }

  public itemParams(id: string): Object {
    return { id }
  }

  public loadMoreFoods(ev: InfiniteScroll) {
    setTimeout(() => {
      this.start += 50;
      this._foodDataSvc.getFoods$(this.searchQueryFoods, this.start, this.foodLimit, this.selectedGroup.id)
        .subscribe((data: Array<IFoodSearchResult>) => {
          this.foods.push(...data);
          this._detectorRef.markForCheck();
        }, (err: { status: string, message: string }) => {
          this._alertCtrl.create({
            title: `Ooops! Error ${err.status}!`,
            message: err.message,
            buttons: ['Got it!']
          }).present();
        });
      ev.complete();
    }, 500);
  }

  public loadMoreRecipes(ev: InfiniteScroll) {
    this.recipeLimit += 50;
    setTimeout(() => {
      ev.complete();
      this._detectorRef.markForCheck();
    }, 1000);
  }

  public refreshItems(): void {
    let loader: Loading = this._loadCtrl.create({
      content: 'Loading...',
      spinner: 'crescent'
    });

    loader.present();
    this.start = 0;
    this._foodDataSvc.getFoods$(this.searchQueryFoods, this.start, this.foodLimit, this.selectedGroup.id)
      .subscribe((data: Array<IFoodSearchResult>) => {
        setTimeout(() => {
          this.foods = [...data];
          loader.dismiss();
          this._detectorRef.markForCheck();
        }, 2000);
      }, (err: { status: string, message: string }) => {
        loader.dismiss();
        this._alertCtrl.create({
          title: `Ooops! Error ${err.status}!`,
          message: err.message,
          buttons: ['Got it!']
        }).present();
      });
  }

  public segmentChange(): void {
    this._detectorRef.markForCheck();
  }

  public showFilter(): void {
    this._alertCtrl.create({
      title: 'Filter foods',
      subTitle: 'Pick a food group',
      inputs: [...this.groups.map((item: FoodGroup) => {
        return {
          type: 'radio',
          label: item.name,
          value: item.id,
          checked: this.selectedGroup.name === item.name
        }
      })],
      buttons: [
        {
          text: 'Done',
          handler: (data: string) => {
            this.selectedGroup = this.groups.filter((item: FoodGroup) => item.id === data)[0];
            this.refreshItems();
          }
        }
      ]
    }).present();
  }

  public toggleItem(item: any, type: string): void {
    if (type === 'food') {
      if (this.selectedFoods.indexOf(item) === -1) {
        this.selectedFoods.push(item);
      } else {
        this.selectedFoods.splice(this.selectedFoods.indexOf(item), 1);
      }
    } else {
      if (this.selectedRecipes.indexOf(item) === -1) {
        this.selectedRecipes.push(item);
      } else {
        this.selectedRecipes.splice(this.selectedRecipes.indexOf(item), 1);
      }
    }

  }

  ionViewWillEnter(): void {
    this.refreshItems();
    this.recipes$ = this._recipeSvc.getRecipes$();
    console.log('Entering...');
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
