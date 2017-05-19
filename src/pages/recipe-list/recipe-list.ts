// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertController, InfiniteScroll, Loading, LoadingController, NavController } from 'ionic-angular';

// Third-party
import { FirebaseListObservable } from 'angularfire2/database';

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
  public queryIngredients: Array<string> = [];
  public recipes$: FirebaseListObservable<Array<Recipe>>;
  public searchQuery: string = '';
  constructor(
    private _alertCtrl: AlertController,
    private _detectorRef: ChangeDetectorRef,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _recipeSvc: RecipeService,
  ) { }

  public addIngredientFilter(): void {
    this._alertCtrl.create({
      title: 'Filter by ingredients',
      subTitle: 'Tip: Type the singular form of the ingredient',
      inputs: [
        {
          name: 'ingredient',
          placeholder: 'E.g. apple, banana, broccoli',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Done',
          handler: (data: { ingredient: string }) => {
            if (!this.queryIngredients.find((query: string) => query.toLocaleLowerCase().includes(data.ingredient.toLocaleLowerCase()))) {
              this.queryIngredients.push(data.ingredient);
              this.queryIngredients = [...this.queryIngredients];
              this._detectorRef.markForCheck();
            }
          }
        }
      ]
    }).present();
  }

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

  public removeQueryIngredient(idx: number): void {
    this.queryIngredients.splice(idx, 1);
    this.queryIngredients = [...this.queryIngredients];
    this._detectorRef.markForCheck();
  }

  public removeRecipe(recipe: Recipe): void {
    this._recipeSvc.removeRecipe(recipe);
    this._detectorRef.markForCheck();
  }

  ionViewWillEnter(): void {
    let loader: Loading = this._loadCtrl.create({
      content: 'Loading...',
      spinner: 'crescent',
      duration: 1000
    });

    loader.present();
    this.recipes$ = this._recipeSvc.getRecipes$();
    this._detectorRef.markForCheck();
    console.log('Entering...');
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
}