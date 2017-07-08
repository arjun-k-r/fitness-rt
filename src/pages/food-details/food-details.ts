// App
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

// Models
import { Food } from '../../models';

@Component({
  selector: 'page-food-details',
  templateUrl: 'food-details.html'
})
export class FoodDetailsPage {
  public food: Food;
  constructor(private _params: NavParams) {
    this.food = _params.get('food');
  }
}