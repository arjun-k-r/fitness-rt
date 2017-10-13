// Third-party
import * as moment from 'moment';

export class BloodPressure {
    constructor(
        public diastolic: number = 0,
        public systolic: number = 0
    ) { }
}

export class BloodPressureLog {
    constructor(
        public date: string = moment().format('dddd'),
        public diastolic: number = 0,
        public notes: string = '',
        public systolic: number = 0
    ) { }
}