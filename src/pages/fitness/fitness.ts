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
  NavController,
  Popover,
  PopoverController
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { Fitness, Nutrition } from '../../models';

// Providers
import { FitnessProvider, NutritionProvider } from '../../providers';

@IonicPage({
  name: 'fitness'
})
@Component({
  templateUrl: 'fitness.html'
})
export class FitnessPage {
  private _authId: string;
  private _authSubscription: Subscription;
  private _loader: Loading;
  private _dailyRequirementsFormSubscription: Subscription;
  private _fitnessSubscription: Subscription;
  private _fitnessFormSubscription: Subscription;
  public age: AbstractControl;
  public customRequirements: Nutrition = new Nutrition();
  public dailyRequirements: Nutrition = new Nutrition();
  public dailyRequirementsForm: FormGroup;
  public fitness: Fitness = new Fitness();
  public fitnessForm: FormGroup;
  public fitnessSegment: string = 'fitnessInfo';
  public gender: AbstractControl;
  public height: AbstractControl;
  public lactating: AbstractControl;
  public pregnant: AbstractControl;
  public weight: AbstractControl;
  // Custom requirements
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
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _fitnessPvd: FitnessProvider,
    private _formBuilder: FormBuilder,
    private _loadCtrl: LoadingController,
    private _nutritionPvd: NutritionProvider,
    private _navCtrl: NavController,
    private _popoverCtrl: PopoverController
  ) {
    this._initFitnessForm();
  }

  private _calculateStandardRequirements(): void {
    this._nutritionPvd.calculateRequirements(this._authId, this.fitness.age, this.fitness.bmr, this.fitness.gender, this.fitness.lactating, this.fitness.macronutrientRatios, this.fitness.pregnant, this.fitness.weight)
      .then((dailyRequirements: Nutrition) => {
        this.dailyRequirements = Object.assign({}, dailyRequirements);
      })
      .catch((err: firebase.FirebaseError) => {
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.message,
          buttons: ['OK']
        }).present();
      });
  }

  private _initCustomRequirements(): void {
    this._nutritionPvd.getRequirements(this._authId, this.fitness.customRequirements)
      .then((dailyRequirements: Nutrition) => {
        this.customRequirements = Object.assign({}, dailyRequirements['$value'] === null ? new Nutrition() : dailyRequirements);
        this.dailyRequirementsForm = this._formBuilder.group({
          energy: [this.customRequirements.energy.value, Validators.required],
          water: [this.customRequirements.water.value, Validators.required],
          protein: [this.customRequirements.protein.value, Validators.required],
          histidine: [this.customRequirements.histidine.value, Validators.required],
          isoleucine: [this.customRequirements.isoleucine.value, Validators.required],
          leucine: [this.customRequirements.leucine.value, Validators.required],
          lysine: [this.customRequirements.lysine.value, Validators.required],
          methionine: [this.customRequirements.methionine.value, Validators.required],
          phenylalanine: [this.customRequirements.phenylalanine.value, Validators.required],
          tryptophan: [this.customRequirements.tryptophan.value, Validators.required],
          threonine: [this.customRequirements.threonine.value, Validators.required],
          valine: [this.customRequirements.valine.value, Validators.required],
          fats: [this.customRequirements.fats.value, Validators.required],
          satFat: [this.customRequirements.satFat.value, Validators.required],
          transFat: [this.customRequirements.transFat.value, Validators.required],
          la: [this.customRequirements.la.value, Validators.required],
          ala: [this.customRequirements.ala.value, Validators.required],
          dha: [this.customRequirements.dha.value, Validators.required],
          epa: [this.customRequirements.epa.value, Validators.required],
          carbs: [this.customRequirements.carbs.value, Validators.required],
          fiber: [this.customRequirements.fiber.value, Validators.required],
          sugars: [this.customRequirements.sugars.value, Validators.required],
          calcium: [this.customRequirements.calcium.value, Validators.required],
          copper: [this.customRequirements.copper.value, Validators.required],
          iron: [this.customRequirements.iron.value, Validators.required],
          magnesium: [this.customRequirements.magnesium.value, Validators.required],
          manganese: [this.customRequirements.manganese.value, Validators.required],
          phosphorus: [this.customRequirements.phosphorus.value, Validators.required],
          potassium: [this.customRequirements.potassium.value, Validators.required],
          selenium: [this.customRequirements.selenium.value, Validators.required],
          sodium: [this.customRequirements.sodium.value, Validators.required],
          zinc: [this.customRequirements.zinc.value, Validators.required],
          vitaminA: [this.customRequirements.vitaminA.value, Validators.required],
          vitaminB1: [this.customRequirements.vitaminB1.value, Validators.required],
          vitaminB2: [this.customRequirements.vitaminB2.value, Validators.required],
          vitaminB3: [this.customRequirements.vitaminB3.value, Validators.required],
          vitaminB5: [this.customRequirements.vitaminB5.value, Validators.required],
          vitaminB6: [this.customRequirements.vitaminB6.value, Validators.required],
          vitaminB9: [this.customRequirements.vitaminB9.value, Validators.required],
          vitaminB12: [this.customRequirements.vitaminB12.value, Validators.required],
          choline: [this.customRequirements.choline.value, Validators.required],
          vitaminC: [this.customRequirements.vitaminC.value, Validators.required],
          vitaminD: [this.customRequirements.vitaminD.value, Validators.required],
          vitaminE: [this.customRequirements.vitaminE.value, Validators.required],
          vitaminK: [this.customRequirements.vitaminK.value, Validators.required],
          alcohol: [this.customRequirements.alcohol.value, Validators.required],
          caffeine: [this.customRequirements.caffeine.value, Validators.required],
        });

        this.energy = this.dailyRequirementsForm.get('energy');
        this.water = this.dailyRequirementsForm.get('water');
        this.protein = this.dailyRequirementsForm.get('protein');
        this.tryptophan = this.dailyRequirementsForm.get('tryptophan');
        this.threonine = this.dailyRequirementsForm.get('threonine');
        this.isoleucine = this.dailyRequirementsForm.get('isoleucine');
        this.leucine = this.dailyRequirementsForm.get('leucine');
        this.lysine = this.dailyRequirementsForm.get('lysine');
        this.methionine = this.dailyRequirementsForm.get('methionine');
        this.phenylalanine = this.dailyRequirementsForm.get('phenylalanine');
        this.valine = this.dailyRequirementsForm.get('valine');
        this.histidine = this.dailyRequirementsForm.get('histidine');
        this.fats = this.dailyRequirementsForm.get('fats');
        this.satFat = this.dailyRequirementsForm.get('satFat');
        this.transFat = this.dailyRequirementsForm.get('transFat');
        this.dha = this.dailyRequirementsForm.get('dha');
        this.la = this.dailyRequirementsForm.get('la');
        this.ala = this.dailyRequirementsForm.get('ala');
        this.epa = this.dailyRequirementsForm.get('epa');
        this.carbs = this.dailyRequirementsForm.get('carbs');
        this.fiber = this.dailyRequirementsForm.get('fiber');
        this.sugars = this.dailyRequirementsForm.get('sugars');
        this.calcium = this.dailyRequirementsForm.get('calcium');
        this.iron = this.dailyRequirementsForm.get('iron');
        this.magnesium = this.dailyRequirementsForm.get('magnesium');
        this.manganese = this.dailyRequirementsForm.get('manganese');
        this.phosphorus = this.dailyRequirementsForm.get('phosphorus');
        this.potassium = this.dailyRequirementsForm.get('potassium');
        this.selenium = this.dailyRequirementsForm.get('selenium');
        this.sodium = this.dailyRequirementsForm.get('sodium');
        this.zinc = this.dailyRequirementsForm.get('zinc');
        this.vitaminA = this.dailyRequirementsForm.get('vitaminA');
        this.vitaminB1 = this.dailyRequirementsForm.get('vitaminB1');
        this.vitaminB2 = this.dailyRequirementsForm.get('vitaminB2');
        this.vitaminB3 = this.dailyRequirementsForm.get('vitaminB3');
        this.vitaminB5 = this.dailyRequirementsForm.get('vitaminB5');
        this.vitaminB6 = this.dailyRequirementsForm.get('vitaminB6');
        this.vitaminB9 = this.dailyRequirementsForm.get('vitaminB9');
        this.vitaminB12 = this.dailyRequirementsForm.get('vitaminB12');
        this.choline = this.dailyRequirementsForm.get('choline');
        this.vitaminC = this.dailyRequirementsForm.get('vitaminC');
        this.vitaminD = this.dailyRequirementsForm.get('vitaminD');
        this.vitaminE = this.dailyRequirementsForm.get('vitaminE');
        this.vitaminK = this.dailyRequirementsForm.get('vitaminK');
        this.alcohol = this.dailyRequirementsForm.get('alcohol');
        this.caffeine = this.dailyRequirementsForm.get('caffeine');

        // Subscribe to custom requirements form changes
        this._dailyRequirementsFormSubscription = this.dailyRequirementsForm.valueChanges.subscribe(
          (changes: {
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
            if (this.dailyRequirementsForm.valid) {
              for (let key in changes) {
                if (this.customRequirements.hasOwnProperty(key)) {
                  this.customRequirements = Object.assign(this.customRequirements, { [key]: +changes[key] });
                }
              }
            }
          },
          (err: Error) => console.error(`Error fetching form changes: ${err}`)
        );
      })
      .catch((err: firebase.FirebaseError) => {
        this._alertCtrl.create({
          title: 'Uhh ohh...',
          subTitle: 'Something went wrong',
          message: err.message,
          buttons: ['OK']
        }).present();
      });
  }

  private _initFitnessForm(): void {
    this.fitnessForm = this._formBuilder.group({
      age: [null, Validators.required],
      gender: ['', Validators.required],
      height: [null, Validators.required],
      lactating: [false, Validators.required],
      pregnant: [false, Validators.required],
      weight: [null, Validators.required]
    });
    this.age = this.fitnessForm.get('age');
    this.gender = this.fitnessForm.get('gender');
    this.height = this.fitnessForm.get('height');
    this.lactating = this.fitnessForm.get('lactating');
    this.pregnant = this.fitnessForm.get('pregnant');
    this.weight = this.fitnessForm.get('weight');
  }

  private _watchFitnessChanges(): void {
    this.fitnessForm.controls['age'].patchValue(this.fitness.age);
    this.fitnessForm.controls['gender'].patchValue(this.fitness.gender);
    this.fitnessForm.controls['height'].patchValue(this.fitness.height);
    this.fitnessForm.controls['lactating'].patchValue(this.fitness.lactating);
    this.fitnessForm.controls['pregnant'].patchValue(this.fitness.pregnant);
    this.fitnessForm.controls['weight'].patchValue(this.fitness.weight);

    this._fitnessFormSubscription = this.fitnessForm.valueChanges.subscribe(
      (changes: {
        age: number;
        gender: string;
        height: number;
        lactating: boolean;
        pregnant: boolean;
        weight: number
      }) => {
        if (!!this.fitnessForm.valid) {
          this.fitness = Object.assign(this.fitness, {
            age: +changes.age,
            bmr: this._fitnessPvd.calculateBmr(changes.age, changes.gender, changes.height, changes.weight),
            gender: changes.gender,
            height: +changes.height,
            lactating: changes.lactating,
            pregnant: changes.pregnant,
            weight: +changes.weight
          });

          if (!this.fitness.customRequirements) {

            // Calculate the daily standard requirements on every change, unless disabled
            this._nutritionPvd.calculateRequirements(this._authId, this.fitness.age, this.fitness.bmr, this.fitness.gender, this.fitness.lactating, this.fitness.macronutrientRatios, this.fitness.pregnant, this.fitness.weight)
              .then((dailyRequirements: Nutrition) => {
                this.dailyRequirements = Object.assign({}, dailyRequirements);
              })
              .catch((err: Error) => {
                this._alertCtrl.create({
                  title: 'Uhh ohh...',
                  subTitle: 'Something went wrong',
                  message: err.toString(),
                  buttons: ['OK']
                }).present();
              });
          }
        }
      },
      (err: Error) => console.error(`Error fetching form changes: ${err}`)
    );

  }

  public macronutrientRatioChange(changedMacronutrient: string): void {
    this.fitness.macronutrientRatios = Object.assign({}, this._nutritionPvd.calibrateMacronutrientRatios(this.fitness.macronutrientRatios, changedMacronutrient));

    if (!this.fitness.customRequirements) {
      this._nutritionPvd.calculateRequirements(this._authId, this.fitness.age, this.fitness.bmr, this.fitness.gender, this.fitness.lactating, this.fitness.macronutrientRatios, this.fitness.pregnant, this.fitness.weight)
        .then((dailyRequirements: Nutrition) => {
          this.dailyRequirements = Object.assign({}, dailyRequirements);
        })
        .catch((err: Error) => {
          this._alertCtrl.create({
            title: 'Uhh ohh...',
            subTitle: 'Something went wrong',
            message: err.toString(),
            buttons: ['OK']
          }).present();
        });
    } else {
      this.dailyRequirementsForm.controls['carbs'].patchValue(this._nutritionPvd.calculateCarbRequirements(this.customRequirements.energy.value, this.fitness.macronutrientRatios));
      this.dailyRequirementsForm.controls['fats'].patchValue(this._nutritionPvd.calculateFatRequirements(this.customRequirements.energy.value, this.fitness.macronutrientRatios));
      this.dailyRequirementsForm.controls['protein'].patchValue(this._nutritionPvd.calculateProteinRequirements(this.customRequirements.energy.value, this.fitness.macronutrientRatios));
    }
  }

  public saveFitness(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();
    Promise.all([
      this._nutritionPvd.saveRequirements(
        this._authId,
        this.fitness.customRequirements ? this.customRequirements : this.dailyRequirements,
        this.fitness.customRequirements
      ),
      this._fitnessPvd.saveFitness(this._authId, this.fitness),
    ])
      .then(() => {
        if (this._loader) {
          this._loader.dismiss();
          this._loader = null;
        }
        this._alertCtrl.create({
          title: 'Success!',
          message: 'Fitness saved successfully!',
          buttons: [{
            text: 'Great'
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
    this._loader = this._loadCtrl.create({
      content: 'Loading...',
      duration: 10000,
      spinner: 'crescent'
    });
    this._loader.present();
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._authId = auth.uid;

        // Subscribe to fitness
        this._fitnessSubscription = this._fitnessPvd.getFitness$(this._authId).subscribe(
          (fitness: Fitness) => {
            if (this._loader) {
              this._loader.dismiss();
              this._loader = null;
            }
            this.fitness = Object.assign({}, fitness['$value'] === null ? this.fitness : fitness);

            // Subscribe to fitness form changes
            this._watchFitnessChanges();

            // Calaculate the daily requirements
            this._calculateStandardRequirements();

            // Initialise the daily custom requirements form
            this._initCustomRequirements();
          },
          (err: firebase.FirebaseError) => {
            this._alertCtrl.create({
              title: 'Uhh ohh...',
              subTitle: 'Something went wrong',
              message: err.message,
              buttons: ['OK']
            }).present();
          }
        );
      }
    });
  }

  ionViewWillLeave(): void {
    this._authSubscription && this._authSubscription.unsubscribe();
    this._dailyRequirementsFormSubscription && this._dailyRequirementsFormSubscription.unsubscribe();
    this._fitnessSubscription && this._fitnessSubscription.unsubscribe();
    this._fitnessFormSubscription && this._fitnessFormSubscription.unsubscribe();
    if (this._loader) {
      this._loader.dismiss();
      this._loader = null;
    }
  }
}
