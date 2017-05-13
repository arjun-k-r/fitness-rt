import { Food } from './food';
import { Nutrition } from './nutrition';

/**
 * Class representing a recipe
 */
export class Recipe {
    /**
     * @constructor
     * @param {string} chef - The user who created the recipe
     * @param {string} cookingMethod - The cooking method used for preparing the recipe
     * @param {number} cookingTemperature - The temperature required for the recipe to be cooked
     * @param {number} cookingTime - The time required for the recipe to be cooked
     * @param {string} difficulty - The difficulty of the recipe according to the number of instructions
     * @param {Array} ingredients - The recipe ingredients
     * @param {Array} instructions - The instructions to fulfill the recipe
     * @param {string} name - The recipe name
     * @param {Nutrition} nutrition - The recipe nutritional values
     * @param {number} portions - Number of portions obtained from the whole recipe
     * @param {number} pral - Indicates the alkalinity of the recipe
     * @param {number} quantity - The quantity of recipe in grams
     * @param {number} servings - The number of servings of a single portion
     * @param {Array} tastes - The tastes a recipe contains
     * @param {string} unit - The unit of measure (e.g. grams)
     */
    constructor(
        public chef: string = '',
        public cookingMethod: string = '',
        public cookingTemperature: number = 0,
        public cookingTime: number = 0,
        public difficulty: string = '',
        public ingredients: Array<Food | Recipe> = [],
        public instructions: Array<string> = [],
        public name: string = '',
        public nutrition: Nutrition = new Nutrition(),
        public portions: number = 1,
        public pral: number = 0,
        public quantity: number = 0,
        public servings: number = 1,
        public tastes: Array<string> = [],
        public unit: string = 'g'
    ) {}
}