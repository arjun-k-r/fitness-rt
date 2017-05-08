import { Food } from './food';
import { Nutrition } from './nutrition';

/**
 * Class representing a recipe
 */
export class Recipe {
    /**
     * @constructor
     * @param {string} chef - The user who created the recipe
     * @param {Array} ingredients - The recipe ingredients
     * @param {string} name - The recipe name
     * @param {Nutrition} nutrition - The recipe nutritional values
     * @param {number} portions - Number of portions obtained from the whole recipe
     * @param {number} pral - Indicates the alkalinity of the recipe
     * @param {number} quantity - The quantity of recipe in grams
     * @param {number} servings - The number of servings of a single portion
     * @param {Array} tastes - The tastes a recipe contains
     */
    constructor(
        public chef: string = '',
        public ingredients: Array<Food | Recipe> = [],
        public name: string = '',
        public nutrition: Nutrition = new Nutrition(),
        public portions: number = 1,
        public pral: number = 0,
        public quantity: number = 100,
        public servings: number = 1,
        public tastes: Array<string> = []
    ) {}
}