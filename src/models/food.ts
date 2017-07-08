import { Nutrition } from './nutrition';

export class Food {
    constructor(
        public name: string = '',
        public ndbno: string = '',
        public group: string = '',
        public ingredients: string = '',
        public nutrition: Nutrition = new Nutrition(),
        public pral: number = 0,
        public quantity: number = 100,
        public servings: number = 1,
        public unit: string = 'g'
    ) { }
}