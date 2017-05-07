// Third-party
import * as moment from 'moment';

// Models
import { Food } from './food';
import { NutrientDeficiencies, NutrientExcesses, Nutrition } from './nutrition';
import { WarningMessage } from './warning-message';

export const MEAL_TYPES: Array<string> = ['Beverages meal', 'Melons meal', 'Fruit meal', 'Starch meal', 'Protein meal'];

/**
 * Class representing the tastes within a meal offered by the meal foods
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
        public mealItems: Array<Food> = [],
        public nickname: string = '',
        public nourishingKey: string = '',
        public nutrition: Nutrition = new Nutrition(),
        public pral: number = 0,
        public quantity: number = 0,
        public serving: MealServing = new MealServing(),
        public tastes: MealTastes = new MealTastes(),
        public time: string = moment().format('HH:mm'),
        public type: string = '',
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
     * @param {Nutrition} dailyNutrition - The daily nutrition acquired from all meals
     * @param {number} date - The date of the meal plan (the day number of the year)
     * @param {NutrientDeficiencies} deficiency - Counts the days of essential nutrient deficiency
     * @param {NutrientExcesses} excess - Counts the days of non-essential nutrient excess
     * @param {Array} meals - The meals of the meal plan from the specified date
     */
    constructor(
        public dailyNutrition: Nutrition = new Nutrition(),
        public date: number = moment().dayOfYear(),
        public deficiency: NutrientDeficiencies = new NutrientDeficiencies(),
        public excess: NutrientExcesses = new NutrientExcesses(),
        public meals: Array<Meal> = []
    ) { }
}

export class MealServing {
    /**
     * @constructor
     * @param chewing - Flag indicating if the user chewed properly the meal
     * @param gratitude - Flag indicating if the user was grateful for his meal
     * @param hunger - Flag indicating if the user has truly hungry
     * @param noDisturbance - Flag indicating if there were no disturbances around (e.g. TV, talking, loud music, agitation, etc.)
     * @param noStress - Flag indicating if the user was relaxed and calm while serving his meal
     * @param organic - Flag indicating if the meal had organic foods
     * @param slowlyEating - Flag indicating if the user ate slowly and savoured his meal
     */
    constructor(
        public chewing: boolean = false,
        public gratitude: boolean = false,
        public hunger: boolean = false,
        public noDisturbance: boolean = false,
        public organic: boolean = false,
        public relaxation: boolean = false,
        public slowlyEating: boolean = false
    ) { }
}