// Third-party
import * as moment from 'moment';

// Models
import { Food } from './food';
import { Goal } from './goal';
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
        public goalsAchieved: boolean = false,
        public lifePoints: number = 0,
        public meals: Meal[] = [],
        public nutrition: Nutrition = new Nutrition(),
        public weekLog: NutritionLog[] = []
    ) { }
}

export class NutritionGoals {
    constructor (
        public breakfastTime: Goal = new Goal(false, ''),
        public dinnerTime: Goal = new Goal(false, ''),
        public foodGroupRestrictions: Goal = new Goal(false, []),
        public mealInterval: Goal = new Goal(false, 0),
        public mealSize: Goal = new Goal(false, 0)
    ) { }
}

export class NutritionLog {
    constructor(
        public date: string,
        public nutrition: Nutrition
    ) { }
}