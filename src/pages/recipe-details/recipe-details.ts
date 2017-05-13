// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert, AlertController, Modal, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';

// Models
import { Food, Recipe } from '../../models';

// Pages
import { FoodSelectPage } from '../food-select/food-select';

// Providers
import { AlertService, NutritionService, RecipeService } from '../../providers';

@Component({
  selector: 'page-recipe-details',
  templateUrl: 'recipe-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeDetailsPage {
  public recipe: Recipe;
  public recipeDetails: string = 'details';
  public recipeInstructions: Array<string>;
  constructor(
    private _alertCtrl: AlertController,
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _nutritionSvc: NutritionService,
    private _params: NavParams,
    private _recipeSvc: RecipeService,
    private _toastCtrl: ToastController
  ) {
    this.recipe = <Recipe>_params.get('recipe');
    this.recipe.ingredients = this.recipe.ingredients || [];
    this.recipe.instructions = this.recipe.instructions || [];
    this.recipeInstructions = [...this.recipe.instructions];
    console.log('Received recipe: ', this.recipe);
  }

  private _updateRecipeDetails(): void {
    this.recipe.nutrition = this._recipeSvc.getRecipeNutrition(this.recipe.ingredients, this.recipe.portions);
    this.recipe.pral = this._nutritionSvc.getPRAL(this.recipe.nutrition);
    this.recipe.quantity = this._recipeSvc.getRecipeSize(this.recipe.ingredients, this.recipe.portions);
  }

  public addIngredients(): void {
    let ingredientSelectModal: Modal = this._modalCtrl.create(FoodSelectPage);
    ingredientSelectModal.present();
    ingredientSelectModal.onDidDismiss((selection: Food | Recipe) => {
      if (!!selection) {
        this.recipe.ingredients.push(selection);
        console.log('My new ingredients: ', this.recipe.ingredients);
        // Update the meal details
        this._updateRecipeDetails();
        this._detectorRef.markForCheck();
      }
    });
  }

  public addInstruction(): void {
    this.recipe.instructions.push('');
    this.recipeInstructions.push('');
  }

  public changePortions(): void {
    this.recipe.nutrition = this._recipeSvc.getRecipeNutrition(this.recipe.ingredients, this.recipe.portions);
    this.recipe.quantity = this._recipeSvc.getRecipeSize(this.recipe.ingredients, this.recipe.portions);
  }

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
            this._updateRecipeDetails();
            this._detectorRef.markForCheck();
          }
        }
      ]
    });
    alert.present();
  }

  public removeIngredient(idx: number): void {
    this.recipe.ingredients.splice(idx, 1);
    this._updateRecipeDetails();
  }

  public removeInstruction(idx: number): void {
    this.recipe.instructions.splice(idx, 1);
    this.recipeInstructions.splice(idx, 1);
  }

  public removeRecipe(): void {
    this._recipeSvc.removeRecipe(this.recipe);
    this._navCtrl.pop();
  }

  public saveRecipe(): void {
    this.recipe.instructions = [...this.recipeInstructions];
    this._updateRecipeDetails();
    this._recipeSvc.saveRecipe(this.recipe);
  }

  public segmentChange(): void {
    this._detectorRef.markForCheck();
  }

  public showCookingInfo(): void {
    this._toastCtrl.create({
      message: this._recipeSvc.getCookMethodInfo(this.recipe.cookingMethod),
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Got it!'
    }).present();
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
