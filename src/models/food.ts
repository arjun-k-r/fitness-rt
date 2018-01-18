import { NutritionalValues } from './nutrition';

export class Food {
    constructor(
        public group: string ,
        public name: string ,
        public ndbno: string,
        public nutrition: NutritionalValues,
        public quantity: number,
        public servings: number,
        public unit: string,
        public uploader?: string
    ) { }
}