// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertController, InfiniteScroll, Loading, LoadingController, ViewController } from 'ionic-angular';

// Third-party
import { FirebaseListObservable } from 'angularfire2';

// Models
import { Food, FoodGroup, IFoodSearchResult, Recipe } from '../../models';

// Providers
import { FOOD_GROUPS, FoodService, RecipeService } from '../../providers';

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
  public selectedItem: IFoodSearchResult | Recipe;
  public selectionSegment: string = 'foods';
  public start: number;
  constructor(
    private _alertCtrl: AlertController,
    private _detectorRef: ChangeDetectorRef,
    private _foodSvc: FoodService,
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
    if (this.selectedItem.hasOwnProperty('ndbno')) {
      this._foodSvc.getFoodReports$(this.selectedItem['ndbno']).then((item: Food) => this._viewCtrl.dismiss(this.selectedItem)).catch((err: Error) => console.log('Error on getting food report: ', err));
    } else {
      this._viewCtrl.dismiss(this.selectedItem);
    }
  }

  public itemParams(id: string): Object {
    return { id }
  }

  public loadMoreFoods(ev: InfiniteScroll) {
    setTimeout(() => {
      this.start += 50;
      this._foodSvc.getFoods$(this.searchQueryFoods, this.start, this.foodLimit, this.selectedGroup.id)
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
      spinner: 'crescent',
      duration: 10000
    });

    loader.present();
    this.start = 0;
    this._foodSvc.getFoods$(this.searchQueryFoods.toLocaleLowerCase(), this.start, this.foodLimit, this.selectedGroup.id)
      .subscribe((data: Array<IFoodSearchResult>) => {
        this.foods = [...data];
        loader.dismiss();
        this._detectorRef.markForCheck();
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

  public selectItem(item: IFoodSearchResult | Recipe): void {
    this.selectedItem = item;
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
