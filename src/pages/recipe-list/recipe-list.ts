// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { InfiniteScroll, Loading, LoadingController, NavController } from 'ionic-angular';

// Third-party
import * as _ from 'lodash';

// Models
import { Recipe } from '../../models';

// Pages
import { RecipeDetailsPage } from '../recipe-details/recipe-details';

// Providers
import { RecipeService } from '../../providers';

@Component({
  selector: 'page-recipe-list',
  templateUrl: 'recipe-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeListPage {
  public detailsPage: any = RecipeDetailsPage;
  public limit: number = 50;
  public recipes: Array<Array<Recipe>> = [[]];
  public searchQuery: string = '';
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _recipeSvc: RecipeService,
  ) { }

  public addNewRecipe(): void {
    let newRecipe: Recipe = new Recipe();
    this._navCtrl.push(RecipeDetailsPage, { recipe: newRecipe });
  }

  public clearSearch(ev: string): void {
    this.searchQuery = '';
    this._detectorRef.markForCheck();
  }

  public loadMore(ev: InfiniteScroll) {
    this.limit += 50;
    setTimeout(() => {
      ev.complete();
      this._detectorRef.markForCheck();
    }, 1000);
  }

  public removeRecipe(recipe: Recipe): void {
    this._recipeSvc.removeRecipe(recipe);
  }

  ionViewWillEnter(): void {
    let loader: Loading = this._loadCtrl.create({
      content: 'Loading...',
      spinner: 'crescent',
      duration: 1000
    });

    loader.present();
    this._recipeSvc.getRecipes$().subscribe((recipes: Array<Recipe>) => {
      this.recipes = _.chunk(recipes, 3);
      console.log(this.recipes);
      this._detectorRef.markForCheck();
    });
    console.log('Entering...');
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
}