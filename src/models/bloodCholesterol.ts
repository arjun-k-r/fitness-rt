// Third-party
import * as moment from 'moment';

export class BloodCholesterol {
    constructor(
        public hdl: number = 0,
        public ldl: number = 0,
        public total: number = 0,
        public triglycerides: number = 0
    ) { }
}

export class BloodCholesterolLog {
    constructor(
        public date: string = moment().format('dddd'),
        public hdl: number = 0,
        public ldl: number = 0,
        public notes: string = '',
        public total: number = 0,
        public triglycerides: number = 0,
    ) { }
}