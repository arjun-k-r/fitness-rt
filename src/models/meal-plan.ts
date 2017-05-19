// Third-party
import * as moment from 'moment';

// Models
import { Food } from './food';
import { NutrientDeficiencies, NutrientExcesses, Nutrition } from './nutrition';
import { Recipe } from './recipe';
import { WarningMessage } from './warning-message';

/**
 * Class representing a meal
 * @class
 * @classdesc A single meal serving during the day (e.g. breakfast, lunch, etc.)
 */
export class Meal {
    constructor(
        public eatingHabits = {
            chewing: false,
            gratitude: false,
            hunger: false,
            relaxation: false,
            vitality: false,
            wellness: false
        },
        public isCold: boolean = false,
        public isNatural: boolean = false,
        public isRaw: boolean = false,
        public mealItems: Array<Food | Recipe> = [],
        public nickname: string = '',
        public nourishingKey: string = '',
        public nutrition: Nutrition = new Nutrition(),
        public pral: number = 0,
        public quantity: number = 0,
        public time: string = moment().format('HH:mm'),
        public warnings: Array<WarningMessage> = [],
        public wasNourishing: boolean = false
    ) { }
}

/**
 * Class representing a meal plan
 * @class
 * @classdesc We need to have a meal plan routine we respect each day and monitor nutrient deficiency or excess
 */
export class MealPlan {
    /**
     * @constructor
     * @param {string} breakfastTime - The hour of the first meal of the day; used as reference for the further meals
     * @param {Nutrition} dailyNutrition - The daily nutrition acquired from all meals
     * @param {number} date - The date of the meal plan (the day number of the year)
     * @param {NutrientDeficiencies} deficiency - Counts the days of essential nutrient deficiency
     * @param {NutrientExcesses} excess - Counts the days of non-essential nutrient excess
     * @param {Array} meals - The meals of the meal plan from the specified date
     */
    constructor(
        public breakfastTime: string = '',
        public dailyNutrition: Nutrition = new Nutrition(),
        public date: number = moment().dayOfYear(),
        public deficiency: NutrientDeficiencies = new NutrientDeficiencies(),
        public excess: NutrientExcesses = new NutrientExcesses(),
        public meals: Array<Meal> = []
    ) { }
}