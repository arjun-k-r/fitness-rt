// Angular
import { Component } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  Modal,
  ModalController,
  NavController,
  NavParams
} from 'ionic-angular';

// Firebase
import { FirebaseError } from 'firebase/app';

// Third-party
import * as moment from 'moment';

// Models
import { Diet, Food, Meal, NutritionalValues, UserProfile } from '../../models';

// Providers
import { DietProvider, NotificationProvider, UserProfileProvider } from '../../providers';

@IonicPage({
  name: 'meal-details',
  segment: 'meals/:id'
})
@Component({
  templateUrl: 'meal-details.html',
})
export class MealDetailsPage {
  private _authId: string;
  private _diet: Diet;
  private _mealIdx: number;
  private _trends: Diet[];
  private _userProfile: UserProfile;
  private _userSubscription: Subscription;
  public meal: Meal;
  public unsavedChanges: boolean = false;
  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _alertCtrl: AlertController,
    private _dietPvd: DietProvider,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private _notifyPvd: NotificationProvider,
    private _params: NavParams,
    private _userPvd: UserProfileProvider
  ) {
    this._authId = this._params.get('authId') || '';
    this._diet = <Diet>this._params.get('diet') || new Diet('', [], null, null);
    this._diet.meals = this._diet.meals || [];
    this._mealIdx = this._params.get('mealIdx') === undefined ? this._diet.meals.length : <number>this._params.get('mealIdx');
    this._trends = <Diet[]>this._params.get('trends') || [];
    this.meal = Object.assign({}, this._diet.meals[this._mealIdx] || new Meal([], new NutritionalValues(), '', 0, 0, moment().format('HH:mm')));
    this.meal.foods = this.meal.foods || [];
    if (!this._authId) {
      this._navCtrl.setRoot('diet');
    }
  }

  private _changeQuantity(food: Food): void {
    this._alertCtrl.create({
      title: 'Quantity',
      subTitle: `How much ${food.name} do you want to eat?`,
      inputs: [
        {
          name: 'quantity',
          placeholder: `${food.quantity.toString()} g`,
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
          handler: (data: { quantity: string }) => {
            food.quantity = +data.quantity;
            this._updateMeal();
          }
        }
      ]
    }).present();
  }

  private _removeFood(idx: number): void {
    this.meal.foods = [...this.meal.foods.slice(0, idx), ...this.meal.foods.slice(idx + 1)];
    this._updateMeal();
  }

  private _updateMeal(): void {
    this.changeMade();
    this.meal.nourishment = this._dietPvd.calculateNourishment(this.meal.foods, true);
    this.meal.quantity = this.meal.foods.reduce((quantity: number, food: Food) => quantity + food.quantity, 0);
    this._diet.meals = [...this._diet.meals.slice(0, this._mealIdx), this.meal, ...this._diet.meals.slice(this._mealIdx + 1)];
    this._diet.nourishment = this._dietPvd.calculateNourishment(this._diet.meals);
    this._dietPvd.calculateRequirement(this._authId, this._userProfile.age, this._userProfile.fitness.bmr, this._userProfile.constitution, this._userProfile.gender, this._userProfile.isLactating, this._userProfile.isPregnant, this._userProfile.measurements.weight)
      .then((r: NutritionalValues) => {
        this._diet.nourishmentAchieved = this._dietPvd.calculateNourishmentFromRequirement(this._diet.nourishment, r);
      })
      .catch((err: FirebaseError) => {
        this._notifyPvd.showError(err.message);
      });
  }

  public addFood(): void {
    const foodListModal: Modal = this._modalCtrl.create('food-list', { authId: this._authId });
    foodListModal.present();
    foodListModal.onDidDismiss((foods: (Food | Meal)[]) => {
      if (!!foods && !!foods.length) {
        if (foods.length === 1 && !('ndbno' in foods[0])) {
          this.meal = <Meal>Object.assign({}, foods[0]);
          this.meal.key = foods[0]['$key'];
          this.meal.foods.forEach((f: Food) => {
            f.quantity = f.quantity * this.meal.servings;
          });
        } else {
          let selectedFoods: any = foods.map((item: Food | Meal) => {
            if ('ndbno' in item) {
              return item;
            }

            return (<Meal>item).foods.map((f: Food) => {
              f.quantity = f.quantity * (<Meal>item).servings;
              return f;
            })
          });
          this.meal.foods = [...this.meal.foods, ...[].concat(...selectedFoods)];
        }
        this._updateMeal();
      }
    });
  }

  public addToFavorites(): void {
    this._alertCtrl.create({
      title: 'Favorite meal',
      subTitle: 'What is the name of this nutritious meal?',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
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
          handler: (data: { name: string }) => {
            this.meal.name = data.name;
            delete this.meal.key;
            this._notifyPvd.showLoading();
            this._dietPvd.saveFavoriteMeal(this._authId, this.meal)
              .then((key: string) => {
                this._notifyPvd.closeLoading();
                this._notifyPvd.showInfo('Meal added to favorites successfully!');
                this.meal.key = key;
              })
              .catch((err: FirebaseError) => {
                this._notifyPvd.showError(err.message);
              });
          }
        }
      ]
    }).present();
  }

  public changeFood(idx: number): void {
    this._actionSheetCtrl.create({
      title: 'Change food',
      buttons: [
        {
          text: 'Change quantity',
          handler: () => {
            this._changeQuantity(this.meal.foods[idx]);
          }
        }, {
          text: 'Remove it',
          handler: () => {
            this._removeFood(idx);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();
  }

  public changeMade(): void {
    this.unsavedChanges = true;
  }

  public removeFavoriteMeal(): void {
    this._dietPvd.removeFavoriteMeal(this._authId, this.meal)
      .then(() => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showInfo('Meal removed from favorites successfully!');
        delete this.meal.name;
        delete this.meal.key;
      })
      .catch((err: FirebaseError) => {
        this._notifyPvd.showError(err.message);
      });
  }

  public removeMeal(): void {
    this._notifyPvd.showLoading();
    this._diet.meals = [...this._diet.meals.slice(0, this._mealIdx), ...this._diet.meals.slice(this._mealIdx + 1)];
    this._diet.nourishment = this._dietPvd.calculateNourishment(this._diet.meals);
    this._dietPvd.calculateRequirement(this._authId, this._userProfile.age, this._userProfile.fitness.bmr, this._userProfile.constitution, this._userProfile.gender, this._userProfile.isLactating, this._userProfile.isPregnant, this._userProfile.measurements.weight)
      .then((r: NutritionalValues) => {
        this._diet.nourishmentAchieved = this._dietPvd.calculateNourishmentFromRequirement(this._diet.nourishment, r);
        this._dietPvd.saveDiet(this._authId, this._diet, this._trends)
          .then(() => {
            this._notifyPvd.closeLoading();
            this._notifyPvd.showInfo('Meal removed successfully!');
            this._navCtrl.pop();
          })
          .catch((err: FirebaseError) => {
            this._notifyPvd.showError(err.message);
          });
      })
      .catch((err: FirebaseError) => {
        this._notifyPvd.showError(err.message);
      });
  }

  public saveMeal(): void {
    this._notifyPvd.showLoading();
    if (!this.meal.name) {
      delete this.meal.name;
    }
    if (!this.meal.key) {
      delete this.meal.key;
    }
    this._dietPvd.calculateRequirement(this._authId, this._userProfile.age, this._userProfile.fitness.bmr, this._userProfile.constitution, this._userProfile.gender, this._userProfile.isLactating, this._userProfile.isPregnant, this._userProfile.measurements.weight)
      .then((r: NutritionalValues) => {
        this._diet.nourishmentAchieved = this._dietPvd.calculateNourishmentFromRequirement(this._diet.nourishment, r);
        this._diet.meals[this._mealIdx] = this.meal;
        this._diet.meals.sort((m1: Meal, m2: Meal) => {
          if (m1.hour > m2.hour) {
            return 1;
          }

          if (m1.hour < m2.hour) {
            return -1;
          }

          return 0;
        });
        this._dietPvd.saveDiet(this._authId, this._diet, this._trends)
          .then(() => {
            this._notifyPvd.closeLoading();
            this._notifyPvd.showInfo('Diet saved successfully!');
            this._navCtrl.pop();
          })
          .catch((err: FirebaseError) => {
            this._notifyPvd.showError(err.message);
          })
      })
      .catch((err: FirebaseError) => {
        this._notifyPvd.showError(err.message);
      });
  }

  public takeHungerTest(): void {
    this._navCtrl.push('hunger-questionaire', { constitution: this._userProfile.constitution })
  }

  public viewFoodGuidelines(): void {
    this._navCtrl.push('food-guidelines', { constitution: this._userProfile.constitution })
  }

  ionViewCanLEave(): boolean | Promise<{}> {
    if (!this.unsavedChanges) {
      return true;
    }
    return new Promise((resolve, reject) => {
      if (this.unsavedChanges) {
        this._alertCtrl.create({
          title: 'Unsaved changes',
          message: 'All your changes will be lost. Are you sure you want to leave?',
          buttons: [
            {
              text: 'No',
              handler: () => {
                reject();
              }
            },
            {
              text: 'Yes',
              handler: () => {
                resolve();
              }
            }
          ]
        });
      }
    });
  }

  ionViewWillEnter(): void {
    this._userSubscription = this._userPvd.getUserProfile$(this._authId).subscribe((u: UserProfile) => {
      this._userProfile = u;
    });
  }

  ionViewWillLeave(): void {
    this._userSubscription.unsubscribe();
  }
}
