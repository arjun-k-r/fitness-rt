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
import { FirebaseError } from 'firebase/app';

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
  private foodFormSubscription: Subscription;
  public authId: string;
  public editMode: boolean = false;
  public food: Food;
  public foodForm: FormGroup;
  public foodGroups: string[] = [...FOOD_GROUPS];
  public foodNourishmentAchieved: NutritionalValues;
  constructor(
    private dietPvd: DietProvider,
    private foodPvd: FoodProvider,
    private notifyPvd: NotificationProvider,
    private params: NavParams,
    private userPvd: UserProfileProvider,
    private viewCtrl: ViewController
  ) {
    this.authId = <string>this.params.get('authId');
    this.food = <Food>this.params.get('food');
    this.editMode = !this.food['$key'];
    this.initFoodForm();
  }

  private initFoodForm(): void {
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
      histidine: new FormControl(this.food.nourishment.histidine.value, [Validators.required]),
      isoleucine: new FormControl(this.food.nourishment.isoleucine.value, [Validators.required]),
      leucine: new FormControl(this.food.nourishment.leucine.value, [Validators.required]),
      lysine: new FormControl(this.food.nourishment.lysine.value, [Validators.required]),
      methionine: new FormControl(this.food.nourishment.methionine.value, [Validators.required]),
      phenylalanine: new FormControl(this.food.nourishment.phenylalanine.value, [Validators.required]),
      threonine: new FormControl(this.food.nourishment.threonine.value, [Validators.required]),
      tryptophan: new FormControl(this.food.nourishment.tryptophan.value, [Validators.required]),
      valine: new FormControl(this.food.nourishment.valine.value, [Validators.required]),
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

  private calculateAchievedNourishment(): void {
    this.userPvd.getUserProfile$(this.authId).subscribe((u: UserProfile) => {
      this.dietPvd.calculateRequirement(this.authId, u.age, u.fitness.bmr, u.constitution, u.gender, u.fitness.goal, u.isLactating, u.isPregnant, u.measurements.weight)
        .then((r: NutritionalValues) => {
          this.foodNourishmentAchieved = this.dietPvd.calculateNourishmentFromRequirement(this.food.nourishment, r);
        })
    }, (err: Error) => {
      this.notifyPvd.showError(err.message);
    });
  }

  private watchFormChanges(): void {
    this.foodFormSubscription = this.foodForm.valueChanges.subscribe(
      changes => {
        if (this.foodForm.valid) {
          for (let key in changes) {
            if (key in this.food) {
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

  public addToAvoidList(): void {
    this.notifyPvd.showLoading();
    this.food.toAvoid = true;
    this.food.isFavorite = false;
    this.foodPvd.saveFood(this.authId, this.food)
      .then(() => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showInfo('Food added to avoid list!');
      })
      .catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      });
  }

  public addToFavorites(): void {
    this.notifyPvd.showLoading();
    this.food.toAvoid = false;
    this.food.isFavorite = true;
    this.foodPvd.saveFood(this.authId, this.food)
      .then(() => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showInfo('Food added to favorites!');
      })
      .catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      });
  }

  public dismiss(): void {
    this.viewCtrl.dismiss();
  }

  public edit(): void {
    this.editMode = true;
  }

  public remove(): void {
    this.notifyPvd.showLoading();
    this.foodPvd.removeFood(this.authId, this.food)
      .then(() => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showInfo('Food removed successfully!');
        this.viewCtrl.dismiss();
      })
      .catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      });
  }

  public save(): void {
    this.notifyPvd.showLoading();
    this.food.isFavorite = false;
    this.food.toAvoid = false;
    this.foodPvd.saveFood(this.authId, this.food)
      .then(() => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showInfo('Food saved successfully!');
        this.viewCtrl.dismiss();
      })
      .catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      });
  }

  ionViewWillEnter(): void {
    this.watchFormChanges();
    this.calculateAchievedNourishment();
  }

  ionViewWillLeave(): void {
    this.foodFormSubscription.unsubscribe();
  }
}