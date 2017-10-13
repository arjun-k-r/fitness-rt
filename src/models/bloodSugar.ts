// Third-party
import * as moment from 'moment';

export class BloodSugar {
    constructor(
        public bedTime: number = 0,
        public fasting: number = 0,
        public postMeal: number = 0,
        public preMeal: number = 0
    ) { }
}

export class BloodSugarLog {
    constructor(
        public date: string = moment().format('dddd'),
        public bedTime: number = 0,
        public fasting: number = 0,
        public postMeal: number = 0,
        public preMeal: number = 0,
        public notes: string = ''
    ) { }
}