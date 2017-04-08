import { Food } from './food';
import { Nutrition } from './nutrition';

export class Meal {
    constructor(
        public eating: { chewing: boolean, silence: boolean, small: boolean } = {
            chewing: true,
            silence: true,
            small: true
        },
        public feeling: { gastricDistress: boolean, tiredness: boolean } = {
            gastricDistress: false,
            tiredness: false
        },
        public foods: Array<Food> = [],
        public hour: number = 0,
        public nutrition: Nutrition = new Nutrition(),
        public organic: boolean = true,
        public pral: number = 0
    ) { }
}

export class MealPlan {
    constructor(
        public dailyNutrition: Nutrition = new Nutrition(),

        // Hours between meals
        public interval: number = 0,
        public meals: Array<Meal> = []
    ) {}
}