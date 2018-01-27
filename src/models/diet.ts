// Models
import { Food } from './food';
import { NutritionalValues } from './nutrition';

export class Meal {
    constructor(
        public foods: Food[],
        public nourishment: NutritionalValues,
        public notes: string,
        public quantity: number,
        public servings: number,
        public hour?: string,
        public name?: string,
        public key?: string
    ) { }
}

export class Diet {
    constructor(
        public date: string,
        public meals: Meal[],
        public nourishment: NutritionalValues,
        public nourishmentAchieved: NutritionalValues
    ) { }
}