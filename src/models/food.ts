import { Nutrition } from './nutrition';

export interface IFoodReportNutrient {
    group: string;
    nutrient_id: string | number;
    name: string;
    unit: string;
    value: string;
}

export interface IFoodReportSearchResult {
    // Data source
    ds: string;
    // Food group
    fg: string;
    // Food name
    name: string;
    // Database id
    ndbno: string;
    // Food nutritional values
    nutrients: Array<IFoodReportNutrient>;
}

export interface IFoodSearchResult {
    ds: string;
    group: string;
    name: string;
    ndbno: string;
}

export class FoodGroup {
    constructor(
        public id: string,
        public name: string
    ) { }
}

/**
 * Class representing a food
 */
export class Food {
    /**
     * @constructor
     * @param {string} group - The USDA Databse food group (e.g. Beverages)
     * @param {string} name - The food name
     * @param {string} ndbno - The USDA Database food id
     * @param {Nutrition} nutrition - The food nutritional values
     * @param {number} pral - Indicates the alkalinity of the food
     * @param {number} quantity - The quantity of food (e.g. 100 food units)
     * @param {number} servings - The number of servings of 100 units of food
     * @param {Array} tastes - The tastes a food contains
     * @param {string} type - The type of food based on dominant nutrient content (e.g. protein, starch, fat, sugar, acid, etc.)
     * @param {string} unit - The unit of measure (e.g. grams)
     */
    constructor(
        public group: string = '',
        public name: string = '',
        public ndbno: string = '',
        public nutrition: Nutrition = new Nutrition(),
        public pral: number = 0,
        public quantity: number = 100,
        public servings: number = 1,
        public tastes: Array<string> = [],
        public type: string = '',
        public unit: string = 'g'
    ) { }
}
