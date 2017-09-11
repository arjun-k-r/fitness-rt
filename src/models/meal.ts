// Third-party
import * as moment from 'moment';

// Models
import { Food } from './food';
import { Nutrition } from './nutrition';
import { Recipe } from './recipe';

export class Meal {
    constructor(
        public foods: (Food | Recipe)[] = [],
        public nutrition: Nutrition = new Nutrition(),
        public quantity: number = 0
    ) { }
}

export class MealPlan {
    constructor(
        public date: number = moment().dayOfYear(),
        public meals: Meal[] = [],
        public nutrition: Nutrition = new Nutrition()
    ) { }
}