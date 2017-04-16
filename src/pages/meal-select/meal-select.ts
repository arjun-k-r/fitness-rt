// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertController, InfiniteScroll, ViewController } from 'ionic-angular';

// Models
import { Food, FoodGroup } from '../../models';

// Providers
import { FOOD_GROUPS, FoodDataService } from '../../providers';

@Component({
  selector: 'page-meal-select',
  templateUrl: 'meal-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MealSelectPage {
  public foods: Array<Food>;
  public groups: Array<FoodGroup> = [...FOOD_GROUPS];
  public limit: number = 50;
  public searchQuery: string = '';
  public selectedGroup: FoodGroup = this.groups[0];
  public selectedFoods: Array<Food> = [];
  public start: number;
  constructor(
    private _alertCtrl: AlertController,
    private _detectorRef: ChangeDetectorRef,
    private _foodDataSvc: FoodDataService,
    private _viewCtrl: ViewController
  ) { }

  public clearSearch(ev): void {
    this.searchQuery = '';
    this.refreshItems();
  }

  public doneSelecting(): void {
    this._viewCtrl.dismiss(this.selectedFoods);
  }

  public itemParams(id: string): Object {
    return { id }
  }

  public loadMore(ev: InfiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.start += 50;
      this._foodDataSvc.getFoods$(this.searchQuery, this.start, this.limit, this.selectedGroup.id)
        .subscribe((data: Array<Food>) => {
          this.foods.push(...data);
          this._detectorRef.markForCheck();
        });
      ev.complete();
    }, 500);
  }

  public refreshItems(): void {
    console.log(this.searchQuery);
    this.start = 0;
    this._foodDataSvc.getFoods$(this.searchQuery, this.start, this.limit, this.selectedGroup.id)
      .subscribe((data: Array<Food>) => {
        setTimeout(() => {
          this.foods = [...data];
          this._detectorRef.markForCheck();
        }, 2000);
      }, (err: { status: string, message: string }) => {
        this._alertCtrl.create({
          title: `Ooops! Error ${err.status}!`,
          message: err.message,
          buttons: ['Got it!']
        }).present();
      });
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

  public toggleItem(food: Food): void {
    if (this.selectedFoods.indexOf(food) === -1) {
      this.selectedFoods.push(food);
    } else {
      this.selectedFoods.splice(this.selectedFoods.indexOf(food), 1);
    }
  }

  ionViewWillEnter(): void {
    this.refreshItems();
    console.log('Entering...');
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
  
}
