// Third-party
import * as moment from 'moment';

// Models
import { Food } from './food';
import { Nutrition } from './nutrition';
import { Recipe } from './recipe';

export class Meal {
    constructor(
        public combos: {
            calmEating: boolean,
            feeling: string,
            overeating: boolean,
            slowEating: boolean
        } = { calmEating: false, feeling: 'Sleepiness', overeating: false, slowEating: false },
        public foods: (Food | Recipe)[] = [],
        public hour: string = moment().format('HH:mm'),
        public nutrition: Nutrition = new Nutrition(),
        public quantity: number = 0
    ) { }
}

export class MealPlan {
    constructor(
        public date: number = moment().dayOfYear(),
        public intoleranceList: Food[] = [],
        public lifePoints: number = 0,
        public meals: Meal[] = [],
        public nutrition: Nutrition = new Nutrition(),
        public weekPlan: MealPlan[] = []
    ) { }
}