// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { ActionSheetController, Alert, AlertController, Modal, ModalController, NavController, NavParams, Platform, Toast, ToastController } from 'ionic-angular';

// Models
import { Food, Recipe } from '../../models';

// Pages
import { FoodSelectPage } from '../food-select/food-select';

// Providers
import { AlertService, NutritionService, PictureService, RecipeService } from '../../providers';

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
    private _actionSheetCtrl: ActionSheetController,
    private _alertCtrl: AlertController,
    private _alertSvc: AlertService,
    private _detectorRef: ChangeDetectorRef,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _nutritionSvc: NutritionService,
    private _params: NavParams,
    private _picService: PictureService,
    private _platform: Platform,
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
    this._recipeSvc.checkCooking(this.recipe);
    this.recipe.pral = this._nutritionSvc.getPRAL(this.recipe.nutrition);
    this.recipe.quantity = this._recipeSvc.getRecipeSize(this.recipe.ingredients, this.recipe.portions);
    this.recipe.difficulty = this._recipeSvc.checkDifficulty(this.recipe);
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
        this._detectorRef.detectChanges();
      }
    });
  }

  public addInstruction(): void {
    this.recipe.instructions.push('');
    this.recipeInstructions.push('');
  }

  public changeImage(inputRef?: HTMLInputElement): void {
    if (this._platform.is('cordova')) {
      this._actionSheetCtrl.create({
        title: 'Change image',
        buttons: [
          {
            text: 'Take photo',
            handler: () => {
              this._picService.takePhoto().then((photoUri: string) => this.recipe.image = photoUri).catch((err: Error) => this._alertSvc.showAlert(err.toString()));
            }
          }, {
            text: 'Choose image',
            handler: () => {
              this._picService.chooseImage().then((photoUri: string) => this.recipe.image = photoUri).catch((err: Error) => this._alertSvc.showAlert(err.toString()));
            }
          }, {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      }).present();
    } else {
      this.uploadImage(inputRef.files[0]);
    }
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
            this._detectorRef.detectChanges();
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
    this._detectorRef.detectChanges();
  }

  public showCookingInfo(): void {
    this._toastCtrl.create({
      message: this._recipeSvc.getCookMethodInfo(this.recipe.cookingMethod),
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Got it!'
    }).present();
  }

  public uploadImage(file?: File): void {
    let canceledUpload: boolean = false,
      toast: Toast = this._toastCtrl.create({
        message: 'Uploading ... 0%',
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Cancel'
      });

    toast.present();
    toast.onWillDismiss(() => {
      canceledUpload = true;
      this._picService.cancelUpload();
    });

    this._picService.uploadImage('recipes', file).subscribe((data: string | number) => {
      console.log(typeof data === 'number');
      if (typeof data === 'number') {
        toast.setMessage(`Uploading ... ${data}%`);
      } else {
        this.recipe.image = data;
      }
    }, (err: Error) => {
      console.log('Error uploading avatar: ', err);
      toast.setMessage('Uhh ohh, something went wrong!');
    },
      () => {
        if (canceledUpload === true) {
          this._alertSvc.showAlert('Your avatar upload has been canceled', '', 'Canceled!');
        } else {
          toast.dismissAll();
          this._alertSvc.showAlert('Your avatar has been updated successfully', '', 'Success!');
          this._detectorRef.detectChanges();
        }
      });
  }

  ionViewWillEnter(): void {
    this._detectorRef.detectChanges();
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
