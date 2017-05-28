// Third-party
import * as moment from 'moment';

// Models
import { Food } from './food';
import { NutrientDeficiencies, NutrientExcesses, Nutrition } from './nutrition';
import { Recipe } from './recipe';
import { WarningMessage } from './warning-message';

export class Meal {
    constructor(
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

export class MealPlan {
    constructor(
        public breakfastTime: string = moment().format('HH:mm'),
        public dailyNutrition: Nutrition = new Nutrition(),
        public date: number = moment().dayOfYear(),
        public deficiency: NutrientDeficiencies = new NutrientDeficiencies(),
        public excess: NutrientExcesses = new NutrientExcesses(),
        public meals: Array<Meal> = []
    ) { }
}