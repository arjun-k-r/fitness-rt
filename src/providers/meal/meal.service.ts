// App
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

// Third-party
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import * as _ from 'lodash';

// Models
import {
  Essentials,
  Food,
  Meal,
  MealPlan,
  Nutrition,
  Recipe,
  WarningMessage
} from '../../models';

// Providers
import { NutritionService } from '../nutrition/nutrition.service';

const CURRENT_DAY: number = moment().dayOfYear();

@Injectable()
export class MealService {
  private _currentMealPlan$: FirebaseObjectObservable<MealPlan>;
  constructor(
    private _afAuth: AngularFireAuth,
    private _db: AngularFireDatabase,
    private _nutritionSvc: NutritionService
  ) { }

  private _calculateDailyAminoacids(nutrition: Nutrition): number {
    let aminoacids: number = 0;
    if (nutrition.histidine.value >= 85) {
      aminoacids++;
    }

    if (nutrition.isoleucine.value >= 85) {
      aminoacids++;
    }

    if (nutrition.leucine.value >= 85) {
      aminoacids++;
    }

    if (nutrition.lysine.value >= 85) {
      aminoacids++;
    }

    if (nutrition.methionine.value >= 85) {
      aminoacids++;
    }

    if (nutrition.phenylalanine.value >= 85) {
      aminoacids++;
    }

    if (nutrition.threonine.value >= 85) {
      aminoacids++;
    }

    if (nutrition.tryptophan.value >= 85) {
      aminoacids++;
    }

    if (nutrition.valine.value >= 85) {
      aminoacids++;
    }

    return aminoacids * 100 / 9;
  }

  private _calculateDailyFattyAcids(nutrition: Nutrition): number {
    let fattyAcids: number = 0;
    if (nutrition.ala.value >= 85) {
      fattyAcids++;
    }

    if (nutrition.dha.value >= 85) {
      fattyAcids++;
    }

    if (nutrition.epa.value >= 85) {
      fattyAcids++;
    }

    if (nutrition.la.value >= 85) {
      fattyAcids++;
    }

    return fattyAcids * 100 / 4;
  }

  private _calculateDailyMinerals(nutrition: Nutrition): number {
    let minerals: number = 0;
    if (nutrition.calcium.value >= 85) {
      minerals++;
    }

    if (nutrition.copper.value >= 85) {
      minerals++;
    }

    if (nutrition.iron.value >= 85) {
      minerals++;
    }

    if (nutrition.magnesium.value >= 85) {
      minerals++;
    }

    if (nutrition.manganese.value >= 85) {
      minerals++;
    }

    if (nutrition.phosphorus.value >= 85) {
      minerals++;
    }

    if (nutrition.potassium.value >= 85) {
      minerals++;
    }

    if (nutrition.selenium.value >= 85) {
      minerals++;
    }

    if (nutrition.sodium.value >= 85) {
      minerals++;
    }

    if (nutrition.zinc.value >= 85) {
      minerals++;
    }

    return minerals * 100 / 10;
  }

  private _calculateDailyVitamins(nutrition: Nutrition): number {
    let vitamins: number = 0;
    if (nutrition.choline.value >= 85) {
      vitamins++;
    }

    if (nutrition.vitaminA.value >= 85) {
      vitamins++;
    }

    if (nutrition.vitaminB1.value >= 85) {
      vitamins++;
    }

    if (nutrition.vitaminB2.value >= 85) {
      vitamins++;
    }

    if (nutrition.vitaminB3.value >= 85) {
      vitamins++;
    }

    if (nutrition.vitaminB5.value >= 85) {
      vitamins++;
    }

    if (nutrition.vitaminB6.value >= 85) {
      vitamins++;
    }

    if (nutrition.vitaminB9.value >= 85) {
      vitamins++;
    }

    if (nutrition.vitaminB12.value >= 85) {
      vitamins++;
    }

    if (nutrition.vitaminC.value >= 85) {
      vitamins++;
    }

    if (nutrition.vitaminD.value >= 85) {
      vitamins++;
    }

    if (nutrition.vitaminE.value >= 85) {
      vitamins++;
    }

    if (nutrition.vitaminK.value >= 85) {
      vitamins++;
    }

    return vitamins * 100 / 13;
  }

  private _checkMealPlan(mealPlan: MealPlan): Array<WarningMessage> {
    let warnings: Array<WarningMessage> = [];
    if (mealPlan.omega3omega6Ratio < 1) {
      warnings.push(new WarningMessage(
        'The Omega-3:Omega-6 ratio is low',
        'Try to reduce your intake of Omega-6 fatty acids or increase your intake of Omega-3 fatty acids. Use the food list page to look for foods rich in these nutrients.'
      ));
    }

    if (mealPlan.potassiumSodiumRatio < 3) {
      warnings.push(new WarningMessage(
        'The Potassium:Sodium ratio is low',
        'Try to reduce your intake of Sodium or increase your intake of Potassium. Use the food list page to look for foods rich in these nutrients.'
      ));
    }

    if (mealPlan.pral > 1) {
      warnings.push(new WarningMessage(
        'Your meal plan is acid formind',
        'Try to reduce your intake of acid forming foods or increase your intake of alkaline forming foods. Use the food list page to look for these foods.'
      ));
    }
    return warnings;
  }

  public calculatePRAL(foods: Array<Food | Recipe>): number {
    return foods.reduce((acc: number, currFood: Food) => acc += (currFood.pral * currFood.servings), 0);
  }

  public calculatePRALDaily(meals: Array<Meal>): number {
    return meals.reduce((acc: number, currMeal: Meal) => acc += currMeal.pral, 0);
  }

  public calculateOmega3Omega6Ratio(meals: Array<Meal>): number {
    let omega3: number = 0,
      omega6: number = 0;
    meals.forEach((meal: Meal) => {
      omega3 += meal.nutrition.ala.value;
      omega3 += meal.nutrition.dha.value;
      omega3 += meal.nutrition.epa.value;
      omega6 += meal.nutrition.la.value;
    });

    return +((omega3 || 1) / (omega6 || 1)).toFixed(2)
  }

  public calculatePotassiumSodiumRatio(meals: Array<Meal>): number {
    let potassium: number = 0,
      sodium: number = 0;
    meals.forEach((meal: Meal) => {
      potassium += meal.nutrition.potassium.value;
      sodium += meal.nutrition.sodium.value;
    });

    return +((potassium || 1) / (sodium || 1)).toFixed(2)
  }

  public calculateDailyEssentials(nutrition: Nutrition): Essentials {
    return new Essentials(
      this._calculateDailyAminoacids(nutrition),
      this._calculateDailyFattyAcids(nutrition),
      this._calculateDailyMinerals(nutrition),
      this._calculateDailyVitamins(nutrition)
    );
  }

  public getMealPlan$(): Observable<MealPlan> {
    return new Observable((observer: Observer<MealPlan>) => {
      this._afAuth.authState.subscribe((auth: firebase.User) => {
        if (!!auth) {
          this._currentMealPlan$ = this._db.object(`/meal-plans/${auth.uid}/${CURRENT_DAY}`);
          this._currentMealPlan$.subscribe((currMealPlan: MealPlan) => {
            if (currMealPlan['$value'] === null) {
              this._currentMealPlan$.set(new MealPlan());
            } else {
              // Firebase removes empty objects on save
              currMealPlan.warnings = currMealPlan.warnings || [];
              currMealPlan.meals = currMealPlan.meals || [];
              observer.next(currMealPlan);
            }
          }, (err: firebase.FirebaseError) => observer.error(err));
        }
      }), (err: firebase.FirebaseError) => observer.error(err);
    });
  }

  public saveMealPlan(mealPlan: MealPlan): void {
    this._nutritionSvc.calculateNutritionPercent(mealPlan.meals, true).then((nutrition: Nutrition) => {
      mealPlan.dailyNutrition = Object.assign({}, nutrition);
      mealPlan.omega3omega6Ratio = this.calculateOmega3Omega6Ratio(mealPlan.meals);
      mealPlan.potassiumSodiumRatio = this.calculatePotassiumSodiumRatio(mealPlan.meals);
      mealPlan.pral = this.calculatePRALDaily(mealPlan.meals);
      mealPlan.warnings = _.compact([
        ...this._checkMealPlan(mealPlan),
        ...this._nutritionSvc.checkNutrition(mealPlan.dailyNutrition)
      ]);
      this._currentMealPlan$.update({
        dailyNutrition: mealPlan.dailyNutrition,
        date: mealPlan.date,
        meals: mealPlan.meals,
        omega3omega6Ratio: mealPlan.omega3omega6Ratio,
        pral: mealPlan.pral,
        warnings: mealPlan.warnings
      });
    }).catch((err: Error) => console.error(err));
  }

  public sortMeals(meals: Array<Meal>): Array<Meal> {
    return _.sortBy(meals, (meal: Meal) => meal.time);
  }
}