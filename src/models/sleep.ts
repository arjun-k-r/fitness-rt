// Third-party
import * as moment from 'moment';

export class Sleep {
    constructor(
        public bedTime: string = moment().format('HH:mm'),
        public combos: {
            noElectronics: boolean,
            noStimulants: boolean,
            relaxation: boolean
        } = { noElectronics: false, noStimulants: false, relaxation: false },
        public date: number = moment().dayOfYear(),
        public duration: number = 0,
        public weekPlan: Sleep[] = []
    ) { }
}