// Angular
import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  Modal,
  ModalController,
  NavController,
  NavParams,
  Toast,
  ToastController
} from 'ionic-angular';
import { Camera } from '@ionic-native/camera';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Food, Nutrition, Recipe } from '../../models';

// Providers
import { PictureProvider, RecipeProvider } from '../../providers';

@IonicPage({
  name: 'recipe-details',
  segment: 'recipes/:id'
})
@Component({
  templateUrl: 'recipe-details.html'
})
export class RecipeDetailsPage {
  @ViewChild('fileInput') fileInput;
  private _authSubscription: Subscription;
  private _loader: Loading;
  private _recipeFormSubscription: Subscription;
  public authId: string;
  public cookingTemperature: AbstractControl;
  public dataView: string = 'Percentages';
  public duration: AbstractControl;
  public editMode: boolean = false;
  public name: AbstractControl;
  public portions: AbstractControl;
  public recipe: Recipe;
  public recipeDailyRequirements: Nutrition = new Nutrition();
  public recipeForm: FormGroup;
  public recipeSegment: string = 'recipeInfo';
  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _formBuilder: FormBuilder,
    private _loadCtrl: LoadingController,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _params: NavParams,
    private _picPvd: PictureProvider,
    private _recipePvd: RecipeProvider,
    private _toastCtrl: ToastController
  ) {
    this.recipe = <Recipe>this._params.get('recipe');
    this.editMode = !this.recipe['$key'];
    this.recipeForm = this._formBuilder.group({
      cookingTemperature: [this.recipe.cookingTemperature, Validators.required],
      duration: [this.recipe.duration, Validators.required],
      name: [this.recipe.name, Validators.required],
      portions: [this.recipe.portions, Validators.required]
    });
  }

  private _changeServings(ingredient: Food | Recipe): void {
    this._alertCtrl.create({
      title: 'Servings',
      subTitle: `${ingredient.name.toString()} (${ingredient.quantity.toString()} g)`,
      inputs: [
        {
          name: 'servings',
          placeholder: `Servings x ${ingredient.quantity.toString()} g`,
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
          handler: (data: { servings: string }) => {
            ingredient.servings = +data.servings;
            this._updateRecipe();
          }
        }
      ]
    }).present();
  }

  private _removeIngredient(idx: number): void {
    this.recipe.ingredients = [...this.recipe.ingredients.slice(0, idx), ...this.recipe.ingredients.slice(idx + 1)];
    this._updateRecipe();
  }

  private _updateRecipe(): void {
    if (!!this.recipe.ingredients.length) {
      this.recipe.nutrition = this._recipePvd.calculateRecipeNutrition(this.recipe);
      this.recipe.quantity = this._recipePvd.calculateRecipeQuantity(this.recipe);
    }
  }

  public addIngredient(): void {
    const ingredientListModal: Modal = this._modalCtrl.create('food-list', { authId: this.authId });
    ingredientListModal.present();
    ingredientListModal.onDidDismiss((ingredients: (Food | Recipe)[]) => {
      if (!!ingredients && !!ingredients.length) {
        this.recipe.ingredients = [...this.recipe.ingredients, ...ingredients];
        this._updateRecipe();
      }
    });
  }

  public changeDataView(): void {
    this.dataView = this.dataView === 'Percentages' ? 'Quantities' : 'Percentages';
  }

  public changeImage(): void {
    if (Camera['installed']()) {
      this._actionSheetCtrl.create({
        title: 'Change image',
        buttons: [
          {
            text: 'Take photo',
            handler: () => {
              this._picPvd.takePhoto().then((photoUri: string) => {
                this.recipe.image = photoUri;
                this.uploadImage();
              }).catch((err: Error) => this._alertCtrl.create({
                title: 'Uhh ohh...',
                subTitle: 'Something went wrong',
                message: err.toString(),
                buttons: ['OK']
              }).present());
            }
          }, {
            text: 'Choose image',
            handler: () => {
              this._picPvd.chooseImage().then((photoUri: string) => {
                this.recipe.image = photoUri;
                this.uploadImage();
              }).catch((err: Error) => this._alertCtrl.create({
                title: 'Uhh ohh...',
                subTitle: 'Something went wrong',
                message: err.toString(),
                buttons: ['OK']
              }).present());
            }
          }, {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      }).present();
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  public changeIngredient(idx: number): void {
    this._actionSheetCtrl.create({
      title: 'Change ingredient',
      buttons: [
        {
          text: 'Change servings',
          handler: () => {
            this._changeServings(this.recipe.ingredients[idx]);
          }
        }, {
          text: 'Remove ingredient',
          handler: () => {
            this._removeIngredient(idx);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();
  }

  public editRecipe(): void {
    this.editMode = true;
  }

  public processWebImage(event): void {
    const reader: FileReader = new FileReader();
    reader.onload = (readerEvent: Event) => {
      this.uploadImage(event.target.files[0]);
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  public removeRecipe(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();
    this._recipePvd.removeRecipe(this.authId, this.recipe)
      .then(() => {
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._alertCtrl.create({
          title: 'Success!',
          message: 'Recipe removed successfully!',
          buttons: [{
            text: 'Great',
            handler: () => {
              this._navCtrl.pop();
            }
          }]
        }).present();
      })
      .catch((err: Error) => {
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.toString(),
          buttons: ['OK']
        }).present();
      });
  }

  public saveRecipe(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();
    this._updateRecipe();
    this._recipePvd.saveRecipe(this.authId, this.recipe)
      .then(() => {
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._alertCtrl.create({
          title: 'Success!',
          message: 'Recipe saved successfully!',
          buttons: [{
            text: 'Great',
            handler: () => {
              this._navCtrl.pop();
            }
          }]
        }).present();
      })
      .catch((err: firebase.FirebaseError) => {
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

  public uploadImage(file?: File): void {
    let canceledUpload: boolean = false,
      uploadComplete: boolean = false;
    const toast: Toast = this._toastCtrl.create({
      message: 'Uploading ... 0%',
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Cancel'
    });

    toast.present();
    toast.onWillDismiss(() => {
      if (!uploadComplete) {
        canceledUpload = true;
        this._picPvd.cancelUpload();
      }
    });

    this._picPvd.uploadImage(this.authId, 'recipes', file).subscribe((data: string | number) => {
      if (typeof data === 'number') {
        toast.setMessage(`Uploading ... ${data}%`);
      } else {
        this.recipe = Object.assign(this.recipe, { image: data });
      }
    }, (err: firebase.FirebaseError) => {
      toast.setMessage(err.message);
    },
      () => {
        if (canceledUpload === false) {
          uploadComplete = true;
          if (toast) {
            toast.dismiss();
          }
          this._toastCtrl.create({
            message: 'Upload complete!',
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'OK',
            duration: 10000
          }).present();
        } else {
          this._toastCtrl.create({
            message: 'Upload canceled',
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'OK',
            duration: 10000
          }).present();
        }
      });
  }

  ionViewWillEnter(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this.authId = auth.uid;

        // Calculate the recipe nutrition relative to the daily requirements
        this._recipePvd.calculateRecipeRequirements(this.authId, this.recipe)
          .then((nutrition: Nutrition) => {
            if (this._loader) {
              this._loader.dismiss();
              this._loader = null;
            }
            this.recipeDailyRequirements = Object.assign({}, nutrition);
          })
          .catch((err: Error) => {
            if (this._loader) {
              this._loader.dismiss();
              this._loader = null;
            }
            this._alertCtrl.create({
              title: 'Uhh ohh...',
              subTitle: 'Something went wrong',
              message: err.toString(),
              buttons: ['OK']
            }).present();
          });
      }
    });

    // Watch for recipe changes
    this._recipeFormSubscription = this.recipeForm.valueChanges.subscribe(
      (changes: {
        cookingTemperature: number;
        duration: number;
        name: string;
        portions: number;
      }
      ) => {
        if (this.recipeForm.valid) {
          this.recipe = Object.assign(this.recipe, {
            cookingTemperature: changes.cookingTemperature,
            duration: changes.duration,
            name: changes.name,
            portions: changes.portions
          });

          this._updateRecipe();
        }
      },
      (err: Error) => console.error(`Error fetching form changes: ${err}`)
    );
  }

  ionViewWillLeave(): void {
    this._authSubscription && this._authSubscription.unsubscribe();
    this._recipeFormSubscription && this._recipeFormSubscription.unsubscribe();
    if (this._loader) {
      this._loader.dismiss();
      this._loader = null;
    }
  }
}