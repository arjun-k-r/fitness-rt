// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Loading, LoadingController, NavController } from 'ionic-angular';

// Models
import { Meal, MealPlan } from '../../models';

// Pages
import { MealDetailsPage } from '../meal-details/meal-details';

// Providers
import { MealService } from '../../providers';

@Component({
  selector: 'page-meal-plan',
  templateUrl: 'meal-plan.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MealPlanPage {
  public detailsPage: any = MealDetailsPage;
  public mealPlan: MealPlan;
  public mealPlanDetails: string = 'meals';
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _mealSvc: MealService,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController
  ) { }

  public addNewMeal(): void {
    this.mealPlan.meals.push(new Meal());
    this._navCtrl.push(this.detailsPage, { mealIdx: this.mealPlan.meals.length - 1, mealPlan: this.mealPlan })
  }

  public removeMeal(mealIdx: number): void {
    this.mealPlan.meals.splice(mealIdx, 1);
    this._mealSvc.saveMeal(this.mealPlan.meals[mealIdx], mealIdx, this.mealPlan);
  }

  public segmentChange(): void {
    this._detectorRef.markForCheck();
  }

  public toggleNourishing(mealIdx: number): void {
    this.mealPlan.meals[mealIdx].wasNourishing = !this.mealPlan.meals[mealIdx].wasNourishing;
    this._mealSvc.saveMeal(this.mealPlan.meals[mealIdx], mealIdx, this.mealPlan);
  }

  ionViewWillEnter(): void {
    let loader: Loading = this._loadCtrl.create({
      content: 'Loading...',
      spinner: 'crescent'
    });

    loader.present();
    this._mealSvc.getMealPlan$().subscribe((mealPlan: MealPlan) => {
      console.log('Received meal plan: ', mealPlan);
      this.mealPlan = mealPlan;
      this.mealPlan.meals = this.mealPlan.meals || [];
      loader.dismiss();
      this._detectorRef.markForCheck();
    });
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
}
