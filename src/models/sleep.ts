// Third-party
import * as moment from 'moment';

export class Sleep {
    constructor(
        public bedTime: string = moment().format('HH:mm'),
        public combos: {
            noElectronics: boolean,
            noStimulants: boolean,
            quality: number,
            relaxation: boolean
        } = { noElectronics: false, noStimulants: false, quality: 0, relaxation: false },
        public date: number = moment().dayOfYear(),
        public duration: number = 0,
        public lifePoints: number = 0,
        public weekLog: SleepLog[] = []
    ) { }
}

export class SleepLog {
    constructor(
        public bedTime: string,
        public date: number,
        public duration: number,
        public quality: number
    ) { }
}