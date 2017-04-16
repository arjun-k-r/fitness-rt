import { Nutrition } from './nutrition';

export interface INdbFood {
    group: string;
    nutrient_id: string | number;
    name: string;
    unit: string;
    value: string;
}

export interface IUsdaFood {
    ds: string;
    group: string;
    name: string;
    ndbno: string;
}

export class FoodGroup {
    constructor(
        public id: string,
        public name: string
    ) {}
}

export class Food {
    constructor(
        public group: string = '',
        public name: string = '',
        public ndbno: string = '',
        public nutrition: Nutrition = new Nutrition(),
        public quantity: number = 100,
        public unit: string = 'g',
        public type: string = 'sweet'
    ) {}
}
