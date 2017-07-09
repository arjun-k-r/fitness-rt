// App
import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

// Models
import { Food } from '../../models';

@IonicPage({
  name: 'food-details',
  segment: 'details:/id'
})
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