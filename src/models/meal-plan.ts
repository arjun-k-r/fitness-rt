import { Food } from './food';
import { Nutrition } from './nutrition';

export class MealFoodItem extends Food {
    constructor(
        public ndbno: string = '',
        public name: string = '',
        public group: string = '',
        public nutrition: Nutrition = new Nutrition(),
        public quantity: number = 100,
        public servings: number = 1,
        public unit: string = 'g',
        public type: string = 'sweet'
    ) {
        super(ndbno, name, group, nutrition, quantity, unit, type);
    }
}

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
        public mealItems: Array<MealFoodItem> = [],
        public nutrition: Nutrition = new Nutrition(),
        public organic: boolean = true,
        public pral: number = 0,
        public quantity: number = 100,
        public time: string = '06:00'
    ) { }
}

export class MealPlan {
    constructor(
        public breakfastTime: string = '06:00',
        public dailyNutrition: Nutrition = new Nutrition(),
        public date: string = '',

        // Hours between meals
        public interval: number = 6,
        public meals: Array<Meal> = []
    ) {}
}