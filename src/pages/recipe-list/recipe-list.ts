// App
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  AlertController,
  IonicPage,
  InfiniteScroll,
  Loading,
  LoadingController,
  NavController,
  Popover,
  PopoverController
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Recipe } from '../../models';

// Providers
import { RecipeProvider } from '../../providers';

@IonicPage({
  name: 'recipes'
})
@Component({
  templateUrl: 'recipe-list.html'
})
export class RecipeListPage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _loader: Loading;
  private _recipeSubscription: Subscription;
  public ingredientsFilter: string[] = [];
  public recipeLimit: number = 50;
  public recipes: Recipe[];
  public recipeSearchQuery: string = '';
  constructor(
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _recipePvd: RecipeProvider,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _popoverCtrl: PopoverController
  ) { }

  public addIngredientFilter(): void {
    this._alertCtrl.create({
      title: 'Filter by ingredients',
      subTitle: 'Tip: Try both singular and plural form',
      inputs: [
        {
          name: 'ingredient',
          placeholder: 'E.g. apples, bananas, strawberries, melon',
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
            if (!this.ingredientsFilter.find((query: string) => query.toLocaleLowerCase().includes(data.ingredient.toLocaleLowerCase()))) {
              this.ingredientsFilter = [...this.ingredientsFilter, data.ingredient];
            }
          }
        }
      ]
    }).present();
  }

  public addRecipe(): void {
    const newRecipe: Recipe = new Recipe();
    this._navCtrl.push('recipe-details', { id: newRecipe.name, recipe: newRecipe });
  }

  public clearSearchRecipes(evenet: string): void {
    this.recipeSearchQuery = '';
  }

  public editRecipe(recipe: Recipe): void {
    this._navCtrl.push('recipe-details', { id: recipe.name, recipe });
  }

  public loadMoreRecipes(ev: InfiniteScroll) {
    this.recipeLimit += 50;
    setTimeout(() => ev.complete(), 1000);
  }

  public removeIngredientQuery(idx: number): void {
    this.ingredientsFilter = [...this.ingredientsFilter.slice(0, idx), ...this.ingredientsFilter.slice(idx + 1)];
  }

  public removeRecipe(recipe: Recipe): void {
    this._recipePvd.removeRecipe(this._authId, recipe);
  }

  public showSettings(event: Popover): void {
    const popover: Popover = this._popoverCtrl.create('settings');
    popover.present({
      ev: event
    });
  }

  ionViewCanEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!auth) {
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._navCtrl.setRoot('registration', {
          history: 'fitness'
        });
      };
    })
  }

  ionViewWillEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._authId = auth.uid;
        this._loader = this._loadCtrl.create({
          content: 'Loading...',
          duration: 10000,
          spinner: 'crescent'
        });
        this._loader.present();
        this._recipeSubscription = this._recipePvd.getRecipes$(this._authId).subscribe((recipes: Recipe[]) => {
          this.recipes = [...recipes];
          if (this._loader) {
            this._loader.dismiss();
            this._loader = null;
          }
        }, (err: firebase.FirebaseError) => {
          if (this._loader) {
            this._loader.dismiss();
            this._loader = null;
          }
          this._alertCtrl.create({
            title: 'Uhh ohh...',
            subTitle: 'Something went wrong',
            message: err.message,
            buttons: ['OK']
          }).present();
        });
      }
    });
  }

  ionViewWillLeave(): void {
    this._authSubscription && this._authSubscription.unsubscribe();
    this._recipeSubscription && this._recipeSubscription.unsubscribe();
    if (this._loader) {
      this._loader.dismiss();
      this._loader = null;
    }
  }
}