// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';

// Models
import { MealPlan } from '../../models';

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
  public mealPlan: MealPlan = new MealPlan();
  constructor(private _detectorRef: ChangeDetectorRef, private _mealSvc: MealService) { }

  ionViewWillEnter(): void {
    this._mealSvc.getMealPlan().then((mealPlan: MealPlan) => {
      this.mealPlan = mealPlan;
      console.log(this.mealPlan);
      this._detectorRef.markForCheck();
    });
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
