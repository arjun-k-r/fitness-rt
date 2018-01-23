// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  IonicPage,
  NavParams,
  ViewController
} from 'ionic-angular';

// Firebase
import * as firebase from 'firebase/app';

// Models
import { Food, NutritionalValues, UserProfile } from '../../models';

// Providers
import { DietProvider, FOOD_GROUPS, FoodProvider, NotificationProvider, UserProfileProvider } from '../../providers';

@IonicPage({
  name: 'food-details'
})
@Component({
  templateUrl: 'food-details.html'
})
export class FoodDetailsPage {
  private _foodFormSubscription: Subscription;
  public authId: string;
  public editMode: boolean = false;
  public food: Food;
  public foodForm: FormGroup;
  public foodGroups: string[] = [...FOOD_GROUPS];
  public foodNourishmentAchieved: NutritionalValues;
  constructor(
    private _dietPvd: DietProvider,
    private _foodPvd: FoodProvider,
    private _notifyPvd: NotificationProvider,
    private _params: NavParams,
    private _userPvd: UserProfileProvider,
    private _viewCtrl: ViewController
  ) {
    this.authId = <string>this._params.get('authId');
    this.food = <Food>this._params.get('food');
    this.editMode = !this.food['$key'];
    this._initFoodForm();
  }

  private _initFoodForm(): void {
    this.foodForm = new FormGroup({
      group: new FormControl(this.food.group, [Validators.required]),
      name: new FormControl(this.food.name, [Validators.required]),
      quantity: new FormControl(this.food.quantity, [Validators.required]),
      energy: new FormControl(this.food.nourishment.energy.value, [Validators.required]),
      water: new FormControl(this.food.nourishment.water.value, [Validators.required]),
      protein: new FormControl(this.food.nourishment.protein.value, [Validators.required]),
      carbs: new FormControl(this.food.nourishment.carbs.value, [Validators.required]),
      fiber: new FormControl(this.food.nourishment.fiber.value, [Validators.required]),
      sugars: new FormControl(this.food.nourishment.sugars.value, [Validators.required]),
      fats: new FormControl(this.food.nourishment.fats.value, [Validators.required]),
      transFat: new FormControl(this.food.nourishment.transFat.value, [Validators.required]),
      la: new FormControl(this.food.nourishment.la.value, [Validators.required]),
      ala: new FormControl(this.food.nourishment.ala.value, [Validators.required]),
      calcium: new FormControl(this.food.nourishment.calcium.value, [Validators.required]),
      copper: new FormControl(this.food.nourishment.copper.value, [Validators.required]),
      iron: new FormControl(this.food.nourishment.iron.value, [Validators.required]),
      magnesium: new FormControl(this.food.nourishment.magnesium.value, [Validators.required]),
      manganese: new FormControl(this.food.nourishment.manganese.value, [Validators.required]),
      phosphorus: new FormControl(this.food.nourishment.phosphorus.value, [Validators.required]),
      potassium: new FormControl(this.food.nourishment.potassium.value, [Validators.required]),
      selenium: new FormControl(this.food.nourishment.selenium.value, [Validators.required]),
      sodium: new FormControl(this.food.nourishment.sodium.value, [Validators.required]),
      zinc: new FormControl(this.food.nourishment.zinc.value, [Validators.required]),
      vitaminA: new FormControl(this.food.nourishment.vitaminA.value, [Validators.required]),
      vitaminB1: new FormControl(this.food.nourishment.vitaminB1.value, [Validators.required]),
      vitaminB2: new FormControl(this.food.nourishment.vitaminB2.value, [Validators.required]),
      vitaminB3: new FormControl(this.food.nourishment.vitaminB3.value, [Validators.required]),
      vitaminB5: new FormControl(this.food.nourishment.vitaminB5.value, [Validators.required]),
      vitaminB6: new FormControl(this.food.nourishment.vitaminB6.value, [Validators.required]),
      vitaminB9: new FormControl(this.food.nourishment.vitaminB9.value, [Validators.required]),
      vitaminB12: new FormControl(this.food.nourishment.vitaminB12.value, [Validators.required]),
      choline: new FormControl(this.food.nourishment.choline.value, [Validators.required]),
      vitaminC: new FormControl(this.food.nourishment.vitaminC.value, [Validators.required]),
      vitaminD: new FormControl(this.food.nourishment.vitaminD.value, [Validators.required]),
      vitaminE: new FormControl(this.food.nourishment.vitaminE.value, [Validators.required]),
      vitaminK: new FormControl(this.food.nourishment.vitaminK.value, [Validators.required])
    });
  }

  private _calculateAchievedNourishment(): void {
    this._userPvd.getUserProfile$(this.authId).subscribe((u: UserProfile) => {
      this._dietPvd.calculateRequirement(u.age, u.constitution, u.gender, u.isLactating, u.isPregnant, u.measurements.weight)
        .then((r: NutritionalValues) => {
          this.foodNourishmentAchieved = this._dietPvd.calculateNourishmentFromRequirement(this.food.nourishment, r);
        })
    }, (err: Error) => {
      this._notifyPvd.showError(err.message);
    });
  }

  private _watchFormChanges(): void {
    this._foodFormSubscription = this.foodForm.valueChanges.subscribe(
      changes => {
        if (this.foodForm.valid) {
          for (let key in changes) {
            if (key in this.food.nourishment) {
              this.food = Object.assign(this.food, { [key]: changes[key] });
            } else if (key in this.food.nourishment) {
              this.food.nourishment[key] = Object.assign(this.food.nourishment[key], { value: +changes[key] });
            }
          }
          this.food = Object.assign(this.food, { uploader: this.authId });
        }
      },
      (err: Error) => console.error(`Error fetching form changes: ${err}`)
    );
  }

  public addToAvoidList(food: Food): void {
    food.toAvoid = true;
    food.isFavorite = false;
    this._foodPvd.saveFood(this.authId, this.food)
      .then(() => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showInfo('Food saved successfully!');
      })
      .catch((err: firebase.FirebaseError) => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showError(err.message);
      });
  }

  public addToFavorites(food: Food): void {
    food.toAvoid = false;
    food.isFavorite = true;
    this._foodPvd.saveFood(this.authId, this.food)
      .then(() => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showInfo('Food saved successfully!');
      })
      .catch((err: firebase.FirebaseError) => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showError(err.message);
      });
  }

  public dismiss(): void {
    this._viewCtrl.dismiss();
  }

  public edit(): void {
    this.editMode = true;
  }

  public remove(): void {
    this._notifyPvd.showLoading();
    this._foodPvd.removeFood(this.authId, this.food)
      .then(() => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showInfo('Food removed successfully!');
        this._viewCtrl.dismiss();
      })
      .catch((err: firebase.FirebaseError) => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showError(err.message);
      });
  }

  public save(): void {
    this._notifyPvd.showLoading();
    this._foodPvd.saveFood(this.authId, this.food)
      .then(() => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showInfo('Food saved successfully!');
      })
      .catch((err: firebase.FirebaseError) => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showError(err.message);
      });
  }

  ionViewWillEnter(): void {
    this._watchFormChanges();
    this._calculateAchievedNourishment();
  }

  ionViewWillLeave(): void {
    this._foodFormSubscription.unsubscribe();
  }
}