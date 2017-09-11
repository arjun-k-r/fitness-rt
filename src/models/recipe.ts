// Models
import { Food } from './food';
import { Nutrition } from './nutrition';

export class Recipe {
    constructor(
        public chef: string = '',
        public cookingTemperature: number = 0,
        public duration: number = 0,
        public image: string = '',
        public ingredients: (Food | Recipe)[] = [],
        public name: string = '',
        public nutrition: Nutrition = new Nutrition(),
        public portions: number = 1,
        public quantity: number = 0,
        public servings: number = 1,
        public unit: string = 'g'
    ) {}
}