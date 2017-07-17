// Third-party
import * as moment from 'moment';

// Models
import { Food } from './food';
import { Nutrition } from './nutrition';
import { Recipe } from './recipe';
import { WarningMessage } from './warning-message';

export class Meal {
    constructor(
        public mealItems: Array<Food | Recipe> = [],
        public nutrition: Nutrition = new Nutrition(),
        public pral: number = 0,
        public quantity: number = 0,
        public time: string = moment().format('HH:mm'),
        public warnings: Array<WarningMessage> = []
    ) { }
}

export class MealPlan {
    constructor(
        public dailyNutrition: Nutrition = new Nutrition(),
        public date: number = moment().dayOfYear(),
        public meals: Array<Meal> = [],
        public omega3omega6Ratio: number = 0,
        public potassiumSodiumRatio: number = 0,
        public pral: number = 0,
        public warnings: Array<WarningMessage> = []
    ) { }
}