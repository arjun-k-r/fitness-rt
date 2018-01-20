// Models
import { Food } from './food';
import { NutritionalValues } from './nutrition';

export class Meal {
    constructor(
        public foods: Food[],
        public nourishment: NutritionalValues,
        public notes: string,
        public quantity: number = 0,
        public hour?: string,
        public name?: string,
    ) { }
}

export class Diet {
    constructor(
        public date: string,
        public meals: Meal[],
        public nourishment: NutritionalValues,
        public nourishmentPercentage: NutritionalValues
    ) { }
}