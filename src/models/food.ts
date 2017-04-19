import { Nutrition } from './nutrition';

export interface IFoodReportNutrient {
    group: string;
    nutrient_id: string | number;
    name: string;
    unit: string;
    value: string;
}

export interface IFoodReportSearchResult {
     // Data source
    ds: string;
    // Food group
    fg: string;
    // Food name
    name: string;
    // Database id
    ndbno: string;
    // Food nutritional values
    nutrients: Array<IFoodReportNutrient>;
}

export interface IFoodSearchResult {
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
        public pral: number = 0,
        public quantity: number = 100,
        public tastes: Array<string> = [],
        public type: string = 'starch',
        public unit: string = 'g'
    ) {}
}
