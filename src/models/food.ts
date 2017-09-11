import { Nutrition } from './nutrition';

export class Food {
    constructor(
        public group: string = '',
        public name: string = '',
        public ndbno: string = '',
        public nutrition: Nutrition = new Nutrition(),
        public quantity: number = 100,
        public servings: number = 1,
        public unit: string = 'g',
        public uploader?: string
    ) { }
}