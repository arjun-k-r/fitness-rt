// Third-party
import * as moment from 'moment';

// Models
import { Food } from './food';
import { Nutrition } from './nutrition';
import { Recipe } from './recipe';

export class Meal {
    constructor(
        public foods: (Food | Recipe)[] = [],
        public hour: string = moment().format('HH:mm'),
        public nutrition: Nutrition = new Nutrition(),
        public quality: number = 0,
        public quantity: number = 0
    ) { }
}

export class MealPlan {
    constructor(
        public date: number = moment().dayOfYear(),
        public meals: Meal[] = [],
        public nutrition: Nutrition = new Nutrition(),
        public weekLog: NutritionLog[] = []
    ) { }
}

export class NutritionLog {
    constructor(
        public date: string,
        public nutrition: Nutrition
    ) { }
}