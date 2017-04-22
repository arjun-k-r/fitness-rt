// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
  public mealPlan: Observable<MealPlan>;
  constructor(private _detectorRef: ChangeDetectorRef, private _mealSvc: MealService) { }

  ionViewWillEnter(): void {
    this.mealPlan = this._mealSvc.getMealPlan();
    this._detectorRef.markForCheck();
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }
}
