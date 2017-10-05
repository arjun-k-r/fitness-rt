// Third-party
import * as moment from 'moment';

// Models
import { Goal } from './goal';

export class Sleep {
    constructor(
        public bedTime: string = moment().format('HH:mm'),
        public combos: {
            goalsAchieved: boolean,
            noElectronics: boolean,
            noStimulants: boolean,
            quality: number,
            relaxation: boolean
        } = { goalsAchieved: false, noElectronics: false, noStimulants: false, quality: 0, relaxation: false },
        public date: number = moment().dayOfYear(),
        public duration: number = 0,
        public lifePoints: number = 0
    ) { }
}

export class SleepGoals {
    constructor(
        public bedTime: Goal = new Goal(false, ''),
        public duration: Goal = new Goal(false, 0)
    ) { }
}

export class SleepLog {
    constructor(
        public bedTime: string,
        public date: string,
        public duration: number,
        public quality: number
    ) { }
}