// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertController, InfiniteScroll } from 'ionic-angular';

// Models
import { Food, FoodGroup } from '../../models';

// Pages
import { FoodDetailsPage } from '../food-details/food-details';

// Providers
import { FOOD_GROUPS, FoodDataService } from '../../providers';

@Component({
  selector: 'page-food-list',
  templateUrl: 'food-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodListPage {
  public detailsPage: any = FoodDetailsPage;
  public foods: Array<Food>;
  public groups: Array<FoodGroup> = [...FOOD_GROUPS];
  public limit: number = 50;
  public searchQuery: string = '';
  public selectedGroup: FoodGroup = this.groups[0];
  public start: number;
  constructor(
    private _alertCtrl: AlertController,
    private _detectorRef: ChangeDetectorRef,
    private _foodDataSvc: FoodDataService
  ) { }

  public clearSearch(ev): void {
    this.searchQuery = '';
    this.refreshItems();
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
      }, (err: {status: string, message: string}) => {
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

  ionViewWillEnter(): void {
    this.refreshItems();
    console.log('Entering...');
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
