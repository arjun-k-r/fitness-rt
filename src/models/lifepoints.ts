// Third-party
import * as moment from 'moment';

export class LifePoints {
    constructor(
        public exercise: number = 0,
        public nutrition: number = 0,
        public sleep: number = 0,
        public timestamp: number = moment().dayOfYear(),
        public totalPoints: number = 0
    ) { }
}