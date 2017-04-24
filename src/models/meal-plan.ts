import { Food } from './food';
import { Nutrition } from './nutrition';

export const MEAL_TYPES: Array<string> = ['Beverages meal', 'Fruit meal', 'Melons meal', 'Milk meal', 'Starch meal', 'Protein meal'];

/**
 * Class representing the tastes within a meal offered by the meal food items
 * @class
 * @classdesc According to Ayurveda, a balanced meal contains all six tastes in order to completely nourish and satisfy the body. 
 */
export class MealTastes {
    constructor(
        public sweet: number = 0,
        public sour: number = 0,
        public salty: number = 0,
        public pungent: number = 0,
        public astrigent: number = 0,
        public bitter: number = 0
    ) { }
}

/**
 * Class representing a meal
 * @class
 * @classdesc A single meal serving during the day (e.g. breakfast, lunch, etc.)
 */
export class Meal {
    constructor(
        public isCold: boolean = true,
        public isRaw: boolean = true,
        public mealItems: Array<MealFoodItem> = [],
        public nutrition: Nutrition = new Nutrition(),
        public pral: number = 0,
        public quantity: number = 0,
        public serving: MealServing = new MealServing(),
        public tastes: MealTastes = new MealTastes(),
        public time: string = '',
        public type: string = '',
        public warnings: Array<MealWarning> = [],
        public wasNourishing: boolean = false
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
     * @param {Array} tastes - The tastes a food contains
     * @param {string} type - The type of food based on dominant nutrient content (e.g. protein, starch, fat, sugar, acid, etc.)
     * @param {string} unit - The unit of measure (e.g. grams)
     */
    constructor(
        public ndbno: string = '',
        public name: string = '',
        public group: string = '',
        public nutrition: Nutrition = new Nutrition(),
        public pral: number = 0,
        public quantity: number = 100,
        public servings: number = 1,
        public tastes: Array<string> = [],
        public type: string = '',
        public unit: string = 'g'

    ) {
        super(ndbno, name, group, nutrition, pral, quantity, tastes, type, unit);
    }
}

export class MealPlan {
    constructor(
        public breakfastTime: string = '06:00 am',
        public dailyNutrition: Nutrition = new Nutrition(),
        public date: string = '',

        // Hours between meals
        public interval: number = 6,
        public meals: Array<Meal> = []
    ) { }
}

export class MealServing {
    constructor(
        public chewing: boolean = false,
        public goodMood: boolean = false,
        public gratitude: boolean = false,
        public hunger: boolean = false,
        public noDisEase: boolean = false,
        public noStress: boolean = false,
        public organic: boolean = false,
        public silence: boolean = false,
        public slowlyEating: boolean = false
    ) { }
}

export class MealWarning {
    constructor(
        public message: string,
        public moreInfo: string
    ) { }
}