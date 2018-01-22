import { NutritionalValues } from './nutrition';

export class Food {
    constructor(
        public group: string ,
        public name: string ,
        public ndbno: string,
        public nourishment: NutritionalValues,
        public quantity: number,
        public unit: string,
        public uploader?: string,
        public isFavorite?: boolean,
        public toAvoid?: boolean
    ) { }
}