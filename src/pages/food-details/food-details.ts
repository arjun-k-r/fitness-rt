// Angular
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavParams,
  ViewController
} from 'ionic-angular';

// Firebase
import * as firebase from 'firebase/app';

// Models
import { Food, Nutrition } from '../../models';

// Providers
import { FOOD_GROUPS, FoodProvider } from '../../providers';

@IonicPage({
  name: 'food-details'
})
@Component({
  templateUrl: 'food-details.html'
})
export class FoodDetailsPage {
  private _foodFormSubscription: Subscription;
  private _loader: Loading;
  public authId: string;
  public dataView: string = 'Percentages';
  public editMode: boolean = false;
  public food: Food;
  public foodDailyRequirements: Nutrition = new Nutrition();
  public foodForm: FormGroup;
  public foodGroups: string[] = [...FOOD_GROUPS];
  public group: AbstractControl;
  public name: AbstractControl;
  public quantity: AbstractControl;
  public energy: AbstractControl;
  public water: AbstractControl;
  public protein: AbstractControl;
  public histidine: AbstractControl;
  public isoleucine: AbstractControl;
  public leucine: AbstractControl;
  public lysine: AbstractControl;
  public methionine: AbstractControl;
  public phenylalanine: AbstractControl;
  public tryptophan: AbstractControl;
  public threonine: AbstractControl;
  public valine: AbstractControl;
  public fats: AbstractControl;
  public satFat: AbstractControl;
  public transFat: AbstractControl;
  public la: AbstractControl;
  public ala: AbstractControl;
  public dha: AbstractControl;
  public epa: AbstractControl;
  public carbs: AbstractControl;
  public fiber: AbstractControl;
  public sugars: AbstractControl;
  public calcium: AbstractControl;
  public copper: AbstractControl;
  public iron: AbstractControl;
  public magnesium: AbstractControl;
  public manganese: AbstractControl;
  public phosphorus: AbstractControl;
  public potassium: AbstractControl;
  public selenium: AbstractControl;
  public sodium: AbstractControl;
  public zinc: AbstractControl;
  public vitaminA: AbstractControl;
  public vitaminB1: AbstractControl;
  public vitaminB2: AbstractControl;
  public vitaminB3: AbstractControl;
  public vitaminB5: AbstractControl;
  public vitaminB6: AbstractControl;
  public vitaminB9: AbstractControl;
  public vitaminB12: AbstractControl;
  public choline: AbstractControl;
  public vitaminC: AbstractControl;
  public vitaminD: AbstractControl;
  public vitaminE: AbstractControl;
  public vitaminK: AbstractControl;
  public alcohol: AbstractControl;
  public caffeine: AbstractControl;
  constructor(
    private _alertCtrl: AlertController,
    private _foodPvd: FoodProvider,
    private _formBuilder: FormBuilder,
    private _loadCtrl: LoadingController,
    private _params: NavParams,
    private _viewCtrl: ViewController
  ) {
    this.authId = <string>this._params.get('authId');
    this.food = <Food>this._params.get('food');
    this.editMode = !this.food['$key'];
    this._initFoodForm();
  }

  private _initFoodForm(): void {
    this.foodForm = this._formBuilder.group({
      group: [this.food.group, Validators.required],
      name: [this.food.name, Validators.required],
      quantity: [this.food.quantity, Validators.required],
      energy: [this.food.nutrition.energy.value, Validators.required],
      water: [this.food.nutrition.water.value, Validators.required],
      protein: [this.food.nutrition.protein.value, Validators.required],
      histidine: [this.food.nutrition.histidine.value, Validators.required],
      isoleucine: [this.food.nutrition.isoleucine.value, Validators.required],
      leucine: [this.food.nutrition.leucine.value, Validators.required],
      lysine: [this.food.nutrition.lysine.value, Validators.required],
      methionine: [this.food.nutrition.methionine.value, Validators.required],
      phenylalanine: [this.food.nutrition.phenylalanine.value, Validators.required],
      tryptophan: [this.food.nutrition.tryptophan.value, Validators.required],
      threonine: [this.food.nutrition.threonine.value, Validators.required],
      valine: [this.food.nutrition.valine.value, Validators.required],
      fats: [this.food.nutrition.fats.value, Validators.required],
      satFat: [this.food.nutrition.satFat.value, Validators.required],
      transFat: [this.food.nutrition.transFat.value, Validators.required],
      la: [this.food.nutrition.la.value, Validators.required],
      ala: [this.food.nutrition.ala.value, Validators.required],
      dha: [this.food.nutrition.dha.value, Validators.required],
      epa: [this.food.nutrition.epa.value, Validators.required],
      carbs: [this.food.nutrition.carbs.value, Validators.required],
      fiber: [this.food.nutrition.fiber.value, Validators.required],
      sugars: [this.food.nutrition.sugars.value, Validators.required],
      calcium: [this.food.nutrition.calcium.value, Validators.required],
      copper: [this.food.nutrition.copper.value, Validators.required],
      iron: [this.food.nutrition.iron.value, Validators.required],
      magnesium: [this.food.nutrition.magnesium.value, Validators.required],
      manganese: [this.food.nutrition.manganese.value, Validators.required],
      phosphorus: [this.food.nutrition.phosphorus.value, Validators.required],
      potassium: [this.food.nutrition.potassium.value, Validators.required],
      selenium: [this.food.nutrition.selenium.value, Validators.required],
      sodium: [this.food.nutrition.sodium.value, Validators.required],
      zinc: [this.food.nutrition.zinc.value, Validators.required],
      vitaminA: [this.food.nutrition.vitaminA.value, Validators.required],
      vitaminB1: [this.food.nutrition.vitaminB1.value, Validators.required],
      vitaminB2: [this.food.nutrition.vitaminB2.value, Validators.required],
      vitaminB3: [this.food.nutrition.vitaminB3.value, Validators.required],
      vitaminB5: [this.food.nutrition.vitaminB5.value, Validators.required],
      vitaminB6: [this.food.nutrition.vitaminB6.value, Validators.required],
      vitaminB9: [this.food.nutrition.vitaminB9.value, Validators.required],
      vitaminB12: [this.food.nutrition.vitaminB12.value, Validators.required],
      choline: [this.food.nutrition.choline.value, Validators.required],
      vitaminC: [this.food.nutrition.vitaminC.value, Validators.required],
      vitaminD: [this.food.nutrition.vitaminD.value, Validators.required],
      vitaminE: [this.food.nutrition.vitaminE.value, Validators.required],
      vitaminK: [this.food.nutrition.vitaminK.value, Validators.required],
      alcohol: [this.food.nutrition.alcohol.value, Validators.required],
      caffeine: [this.food.nutrition.caffeine.value, Validators.required],
    });

    this.group = this.foodForm.get('group');
    this.name = this.foodForm.get('name');
    this.quantity = this.foodForm.get('quantity');
    this.energy = this.foodForm.get('energy');
    this.water = this.foodForm.get('water');
    this.protein = this.foodForm.get('protein');
    this.tryptophan = this.foodForm.get('tryptophan');
    this.threonine = this.foodForm.get('threonine');
    this.isoleucine = this.foodForm.get('isoleucine');
    this.leucine = this.foodForm.get('leucine');
    this.lysine = this.foodForm.get('lysine');
    this.methionine = this.foodForm.get('methionine');
    this.phenylalanine = this.foodForm.get('phenylalanine');
    this.valine = this.foodForm.get('valine');
    this.histidine = this.foodForm.get('histidine');
    this.fats = this.foodForm.get('fats');
    this.satFat = this.foodForm.get('satFat');
    this.transFat = this.foodForm.get('transFat');
    this.dha = this.foodForm.get('dha');
    this.la = this.foodForm.get('la');
    this.ala = this.foodForm.get('ala');
    this.epa = this.foodForm.get('epa');
    this.carbs = this.foodForm.get('carbs');
    this.fiber = this.foodForm.get('fiber');
    this.sugars = this.foodForm.get('sugars');
    this.calcium = this.foodForm.get('calcium');
    this.iron = this.foodForm.get('iron');
    this.magnesium = this.foodForm.get('magnesium');
    this.manganese = this.foodForm.get('manganese');
    this.phosphorus = this.foodForm.get('phosphorus');
    this.potassium = this.foodForm.get('potassium');
    this.selenium = this.foodForm.get('selenium');
    this.sodium = this.foodForm.get('sodium');
    this.zinc = this.foodForm.get('zinc');
    this.vitaminA = this.foodForm.get('vitaminA');
    this.vitaminB1 = this.foodForm.get('vitaminB1');
    this.vitaminB2 = this.foodForm.get('vitaminB2');
    this.vitaminB3 = this.foodForm.get('vitaminB3');
    this.vitaminB5 = this.foodForm.get('vitaminB5');
    this.vitaminB6 = this.foodForm.get('vitaminB6');
    this.vitaminB9 = this.foodForm.get('vitaminB9');
    this.vitaminB12 = this.foodForm.get('vitaminB12');
    this.choline = this.foodForm.get('choline');
    this.vitaminC = this.foodForm.get('vitaminC');
    this.vitaminD = this.foodForm.get('vitaminD');
    this.vitaminE = this.foodForm.get('vitaminE');
    this.vitaminK = this.foodForm.get('vitaminK');
    this.alcohol = this.foodForm.get('alcohol');
    this.caffeine = this.foodForm.get('caffeine');
  }

  private _watchFoodChanges(): void {
    this._foodFormSubscription = this.foodForm.valueChanges.subscribe(
      (changes: {
        group: string;
        name: string;
        quantity: number;
        energy: number;
        water: number;
        protein: number;
        histidine: number;
        isoleucine: number;
        leucine: number;
        lysine: number;
        methionine: number;
        phenylalanine: number;
        tryptophan: number;
        threonine: number;
        valine: number;
        fats: number;
        satFat: number;
        transFat: number;
        la: number;
        ala: number;
        dha: number;
        epa: number;
        carbs: number;
        fiber: number;
        sugars: number;
        calcium: number;
        copper: number;
        iron: number;
        magnesium: number;
        manganese: number;
        phosphorus: number;
        potassium: number;
        selenium: number;
        sodium: number;
        zinc: number;
        vitaminA: number;
        vitaminB1: number;
        vitaminB2: number;
        vitaminB3: number;
        vitaminB5: number;
        vitaminB6: number;
        vitaminB9: number;
        vitaminB12: number;
        choline: number;
        vitaminC: number;
        vitaminD: number;
        vitaminE: number;
        vitaminK: number;
        alcohol: number;
        caffeine: number;
      }
      ) => {
        if (this.foodForm.valid) {
          for (let key in changes) {
            if (this.food.hasOwnProperty(key)) {
              this.food = Object.assign(this.food, { [key]: changes[key] });
            } else if (this.food.nutrition.hasOwnProperty(key)) {
              this.food.nutrition[key] = Object.assign(this.food.nutrition[key], { value: +changes[key] });
            }
          }
          this.food = Object.assign(this.food, { uploader: this.authId });
        }
      },
      (err: Error) => console.error(`Error fetching form changes: ${err}`)
    );
  }

  public changeDataView(): void {
    this.dataView = this.dataView === 'Percentages' ? 'Quantities' : 'Percentages';
  }

  public dismiss(): void {
    this._viewCtrl.dismiss();
  }

  public editFood(): void {
    this.editMode = true;
  }

  public removeFood(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();
    this._foodPvd.removeFood(this.authId, this.food)
      .then(() => {
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._alertCtrl.create({
          title: 'Success!',
          message: 'Food removed successfully!',
          buttons: [{
            text: 'Great',
            handler: () => {
              this._viewCtrl.dismiss();
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

  public saveFood(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();
    this._foodPvd.saveFood(this.authId, this.food)
      .then(() => {
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._alertCtrl.create({
          title: 'Success!',
          message: 'Food saved successfully!',
          buttons: [{
            text: 'Great',
            handler: () => {
              this._viewCtrl.dismiss();
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

  ionViewWillEnter(): void {
    this._loader = this._loadCtrl.create({
      content: 'Loading...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();

    // Watch for food changes
    this._watchFoodChanges();

    // Calculate the food nutrition relative to the daily requirements
    this._foodPvd.calculateFoodRequirements(this.authId, this.food)
      .then((nutrition: Nutrition) => {
        this.foodDailyRequirements = Object.assign({}, nutrition);
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
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

  ionViewWillLeave(): void {
    this._foodFormSubscription && this._foodFormSubscription.unsubscribe();
    if (this._loader) {
      this._loader.dismiss();
      this._loader = null;
    }
  }
}