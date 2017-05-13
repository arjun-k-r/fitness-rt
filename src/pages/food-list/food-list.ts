// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertController, InfiniteScroll, Loading, LoadingController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

// Models
import { IFoodSearchResult, FoodGroup } from '../../models';

// Pages
import { FoodDetailsPage } from '../food-details/food-details';

// Providers
import { AlertService, FOOD_GROUPS, FoodService } from '../../providers';

@Component({
  selector: 'page-food-list',
  templateUrl: 'food-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodListPage {
  private _foodSubscription: Subscription;
  private _querying: boolean = false;
  public detailsPage: any = FoodDetailsPage;
  public foods: Array<IFoodSearchResult>;
  public groups: Array<FoodGroup> = [...FOOD_GROUPS];
  public limit: number = 50;
  public searchQuery: string = '';
  public selectedGroup: FoodGroup = this.groups[0];
  public start: number;
  constructor(
    private _alertCtrl: AlertController,
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _foodSvc: FoodService,
    private _loadCtrl: LoadingController
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
      this._foodSvc.getFoods$(this.searchQuery.toLocaleLowerCase(), this.start, this.limit, this.selectedGroup.id)
        .subscribe((data: Array<IFoodSearchResult>) => {
          this.foods.push(...data);
          this._detectorRef.markForCheck();
        });
      ev.complete();
    }, 500);
  }

  public refreshItems(): void {
    if (!this._querying) {
      this._querying = true;
      let loader: Loading = this._loadCtrl.create({
        content: 'Loading...',
        spinner: 'crescent',
        duration: 30000
      }), doneLoading: boolean = false;

      loader.present();
      this.start = 0;

      if (!!this._foodSubscription) {
        this._foodSubscription.unsubscribe();
      }
      this._foodSubscription = this._foodSvc.getFoods$(this.searchQuery.toLocaleLowerCase(), this.start, this.limit, this.selectedGroup.id)
        .subscribe((data: Array<IFoodSearchResult>) => {
          this.foods = [...data];
          doneLoading = true;
          loader.dismiss();
          this._detectorRef.markForCheck();
        }, (err: { status: string, message: string }) => {
          doneLoading = true;
          loader.dismiss();
          this._alertSvc.showAlert(err.message, `Error ${err.status}!`, 'Whoops... something went wrong');
        });

      loader.onDidDismiss(() => {
        this._querying = false;
        if (!doneLoading) {
          this._foodSubscription.unsubscribe();
          this._alertSvc.showAlert('Please try again in a few minutes', 'The food request failed', 'Whoops... something went wrong');
        }
      });
    }
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
