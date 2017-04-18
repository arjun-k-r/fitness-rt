import { Food } from './food';
import { Nutrition } from './nutrition';

/**
 * Class representing a meal
 * @class
 * @classdesc A single meal serving during the day (e.g. breakfast, lunch, etc.)
 */
export class Meal {
    constructor(
        public distress: boolean = false,
        public mealItems: Array<MealFoodItem> = [],
        public nutrition: Nutrition = new Nutrition(),
        public pral: number = 0,
        public quantity: number = 100,
        public serving: MealServing = new MealServing(),
        public time: string = '06:00',
        public warnings: Array<MealWarning> = []
    ) { }
}

/**
 * Class representing a single food from a meal
 * @class
 * @classdesc A single meal (e.g. breakfast) can contain a combination of food items (e.g. nuts and apples)
 * @extends Food
 */
export class MealFoodItem extends Food {
    /**
     * @constructor
     * @param {string} ndbno - The USDA Database food id
     * @param {string} name - The food name
     * @param {string} group - The USDA Databse food group (e.g. Beverages)
     * @param {Nutrition} nutrition - The food nutritional values
     * @param {number} quantity - The quantity of food (e.g. 100 food units)
     * @param {number} servings - The number of same food items
     * @param {string} unit - The unit of measure (e.g. grams)
     * @param {string} type - The type of food based on dominant nutrient content (e.g. protein, starch, fat, sugar, acid, etc.)
     */
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

export class MealWarning {
  constructor(
    public isGood: boolean,
    public message: string,
    public moreInfo: string
  ) { }
}

export class MealServing {
    constructor(
        public badMood: boolean = true,
        public beforeWork: boolean = false,
        public chewing: boolean = true,
        public disEase: boolean = false,
        public gratitude: boolean = true,
        public hunger: boolean = true,
        public organic: boolean = true,
        public overeating: boolean = false,
        public silence: boolean = true
    ) {}
}