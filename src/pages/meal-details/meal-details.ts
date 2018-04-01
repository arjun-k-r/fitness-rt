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
  private authId: string;
  private diet: Diet;
  private mealIdx: number;
  private trends: Diet[];
  private userProfile: UserProfile;
  private userSubscription: Subscription;
  public meal: Meal;
  public unsavedChanges: boolean = false;
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private dietPvd: DietProvider,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private notifyPvd: NotificationProvider,
    private params: NavParams,
    private userPvd: UserProfileProvider
  ) {
    this.authId = this.params.get('authId') || '';
    this.diet = <Diet>this.params.get('diet') || new Diet('', [], null, null);
    this.diet.meals = this.diet.meals || [];
    this.mealIdx = this.params.get('mealIdx') === undefined ? this.diet.meals.length : <number>this.params.get('mealIdx');
    this.trends = <Diet[]>this.params.get('trends') || [];
    this.meal = Object.assign({}, this.diet.meals[this.mealIdx] || new Meal([], new NutritionalValues(), '', 0, 0, moment().format('HH:mm')));
    this.meal.foods = this.meal.foods || [];
    if (!this.authId) {
      this.navCtrl.setRoot('diet');
    }
  }

  private changeQuantity(food: Food): void {
    this.alertCtrl.create({
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
            this.updateMeal();
          }
        }
      ]
    }).present();
  }

  private removeFood(idx: number): void {
    this.meal.foods = [...this.meal.foods.slice(0, idx), ...this.meal.foods.slice(idx + 1)];
    this.updateMeal();
  }

  private updateMeal(): void {
    this.changeMade();
    this.meal.nourishment = this.dietPvd.calculateNourishment(this.meal.foods, true);
    this.meal.quantity = this.meal.foods.reduce((quantity: number, food: Food) => quantity + food.quantity, 0);
    this.diet.meals = [...this.diet.meals.slice(0, this.mealIdx), this.meal, ...this.diet.meals.slice(this.mealIdx + 1)];
    this.diet.nourishment = this.dietPvd.calculateNourishment(this.diet.meals);
    this.dietPvd.calculateRequirement(this.authId, this.userProfile.age, this.userProfile.fitness.bmr, this.userProfile.constitution, this.userProfile.gender, this.userProfile.fitness.goal, this.userProfile.isLactating, this.userProfile.isPregnant, this.userProfile.measurements.weight, this.diet.date)
      .then((r: NutritionalValues) => {
        this.diet.nourishmentAchieved = this.dietPvd.calculateNourishmentFromRequirement(this.diet.nourishment, r);
      })
      .catch((err: FirebaseError) => {
        this.notifyPvd.showError(err.message);
      });
  }

  public addFood(): void {
    const foodListModal: Modal = this.modalCtrl.create('food-list', { authId: this.authId });
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
        this.updateMeal();
      }
    });
  }

  public addToFavorites(): void {
    this.alertCtrl.create({
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
            this.notifyPvd.showLoading();
            this.dietPvd.saveFavoriteMeal(this.authId, this.meal)
              .then((key: string) => {
                this.notifyPvd.closeLoading();
                this.notifyPvd.showInfo('Meal added to favorites successfully!');
                this.meal.key = key;
              })
              .catch((err: FirebaseError) => {
                this.notifyPvd.closeLoading();
                this.notifyPvd.showError(err.message);
              });
          }
        }
      ]
    }).present();
  }

  public changeFood(idx: number): void {
    this.actionSheetCtrl.create({
      title: 'Change food',
      buttons: [
        {
          text: 'Change quantity',
          handler: () => {
            this.changeQuantity(this.meal.foods[idx]);
          }
        }, {
          text: 'Remove it',
          handler: () => {
            this.removeFood(idx);
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
    this.dietPvd.removeFavoriteMeal(this.authId, this.meal)
      .then(() => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showInfo('Meal removed from favorites successfully!');
        delete this.meal.name;
        delete this.meal.key;
      })
      .catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      });
  }

  public removeMeal(): void {
    this.notifyPvd.showLoading();
    this.diet.meals = [...this.diet.meals.slice(0, this.mealIdx), ...this.diet.meals.slice(this.mealIdx + 1)];
    this.diet.nourishment = this.dietPvd.calculateNourishment(this.diet.meals);
    this.dietPvd.calculateRequirement(this.authId, this.userProfile.age, this.userProfile.fitness.bmr, this.userProfile.constitution, this.userProfile.gender, this.userProfile.fitness.goal, this.userProfile.isLactating, this.userProfile.isPregnant, this.userProfile.measurements.weight, this.diet.date)
      .then((r: NutritionalValues) => {
        this.diet.nourishmentAchieved = this.dietPvd.calculateNourishmentFromRequirement(this.diet.nourishment, r);
        this.dietPvd.saveDiet(this.authId, this.diet, this.trends)
          .then(() => {
            this.notifyPvd.closeLoading();
            this.notifyPvd.showInfo('Meal removed successfully!');
            this.navCtrl.pop();
          })
          .catch((err: FirebaseError) => {
            this.notifyPvd.closeLoading();
            this.notifyPvd.showError(err.message);
          });
      })
      .catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      });
  }

  public saveMeal(): void {
    this.notifyPvd.showLoading();
    if (!this.meal.name) {
      delete this.meal.name;
    }
    if (!this.meal.key) {
      delete this.meal.key;
    }
    this.dietPvd.calculateRequirement(this.authId, this.userProfile.age, this.userProfile.fitness.bmr, this.userProfile.constitution, this.userProfile.gender, this.userProfile.fitness.goal, this.userProfile.isLactating, this.userProfile.isPregnant, this.userProfile.measurements.weight, this.diet.date)
      .then((r: NutritionalValues) => {
        this.diet.nourishmentAchieved = this.dietPvd.calculateNourishmentFromRequirement(this.diet.nourishment, r);
        this.diet.meals[this.mealIdx] = this.meal;
        this.diet.meals.sort((m1: Meal, m2: Meal) => {
          if (m1.hour > m2.hour) {
            return 1;
          }

          if (m1.hour < m2.hour) {
            return -1;
          }

          return 0;
        });
        this.dietPvd.saveDiet(this.authId, this.diet, this.trends)
          .then(() => {
            this.notifyPvd.closeLoading();
            this.notifyPvd.showInfo('Diet saved successfully!');
            this.navCtrl.pop();
          })
          .catch((err: FirebaseError) => {
            this.notifyPvd.closeLoading();
            this.notifyPvd.showError(err.message);
          })
      })
      .catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      });
  }

  public takeHungerTest(): void {
    this.navCtrl.push('hunger-questionaire', { constitution: this.userProfile.constitution })
  }

  public viewFoodGuidelines(): void {
    this.navCtrl.push('food-guidelines', { constitution: this.userProfile.constitution })
  }

  ionViewCanLEave(): boolean | Promise<{}> {
    if (!this.unsavedChanges) {
      return true;
    }
    return new Promise((resolve, reject) => {
      if (this.unsavedChanges) {
        this.alertCtrl.create({
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
    this.userSubscription = this.userPvd.getUserProfile$(this.authId).subscribe((u: UserProfile) => {
      this.userProfile = u;
    }, (err: FirebaseError) => {
      this.notifyPvd.showError(err.message);
    });
  }

  ionViewWillLeave(): void {
    this.userSubscription.unsubscribe();
  }
}
