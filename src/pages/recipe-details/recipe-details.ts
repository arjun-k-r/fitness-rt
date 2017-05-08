// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert, AlertController, Modal, ModalController, NavController, NavParams } from 'ionic-angular';

// Models
import { Food, IFoodSearchResult, Recipe } from '../../models';

// Pages
import { FoodSelectPage } from '../food-select/food-select';

// Providers
import { AlertService, RecipeService } from '../../providers';

@Component({
  selector: 'page-recipe-details',
  templateUrl: 'recipe-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeDetailsPage {
  public recipe: Recipe;
  public recipeDetails: string = 'details';
  constructor(
    private _alertCtrl: AlertController,
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _params: NavParams,
    private _recipeSvc: RecipeService
  ) {
    this.recipe = <Recipe>_params.get('recipe');
    console.log('Received recipe: ', this.recipe);
  }

  /**
   * Update the meal whenever changes occur
   * @returns {void}
   */
  private _updateRecipeDetails(): void {
    this.recipe.nutrition = this._recipeSvc.getRecipeNutrition(this.recipe.ingredients, this.recipe.portions);
    this.recipe.pral = this._recipeSvc.getRecipePral(this.recipe.ingredients);
    this.recipe.quantity = this._recipeSvc.getRecipeSize(this.recipe.ingredients);
  }

  /**
   * Updates the ingredient quantity and nutrients to the new serving size and calls recipe update method afterwards
   * @param {Food} ingredient - The ingredient to update
   * @returns {void}
   */
  private _changeItemQuantity(ingredient: Food | Recipe): void {
    this._recipeSvc.changeQuantities(ingredient);
    this._updateRecipeDetails();
  }

  /**
   * Adds new ingredients to the recipe
   * @returns {void}
   */
  public addIngredients(): void {
    let ingredientSelectModal: Modal = this._modalCtrl.create(FoodSelectPage);
    ingredientSelectModal.present();
    ingredientSelectModal.onDidDismiss((selections: { foods: Array<IFoodSearchResult>, recipes: Array<Recipe> }) => {

      // Request Food report for each item
      this._recipeSvc.serializeIngredientss(selections.foods).then((items: Array<Food>) => {
        this.recipe.ingredients.push(...items);
        this.recipe.ingredients.push(...selections.recipes)
        console.log(this.recipe.ingredients);
        // Update the meal details
        this._updateRecipeDetails();
        this._detectorRef.markForCheck();
      }, error => {
        console.log(error);
      });
    });
  }

  public changePortions(): void {
    this.recipe.nutrition = this._recipeSvc.getRecipeNutrition(this.recipe.ingredients, this.recipe.portions);
  }

  /**
   * Shows a a modal dialog to change the number of servings of a food
   * @description A single serving is 100g. A meal may contain more than 100g of a food
   * @param {Food} item - The food the change servings
   * @returns {void}
   */
  public changeServings(item: Food): void {
    let alert: Alert = this._alertCtrl.create({
      title: 'Servings',
      subTitle: `${item.name.toString()} (${item.quantity.toString()}${item.unit.toString()})`,
      inputs: [
        {
          name: 'servings',
          placeholder: 'Servings x 100g',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Done',
          handler: data => {
            item.servings = +data.servings;
            this._changeItemQuantity(item);
            this._detectorRef.markForCheck();
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Removes ingredient from the recipe and calls recipe update method afterwards
   * @param idx - The index of the ingredient to remove
   * @returns {void}
   */
  public removeIngredient(idx: number): void {
    this.recipe.ingredients.splice(idx, 1);
    this._updateRecipeDetails();
  }

  /**
   * Saves the recipe to the database
   * @returns {void}
   */
  public saveRecipe(): void {
    this._recipeSvc.saveRecipe(this.recipe);
  }

  public segmentChange(): void {
    this._detectorRef.markForCheck();
  }

  ionViewWillEnter(): void {
    this._detectorRef.detectChanges();
    this._detectorRef.markForCheck();
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
