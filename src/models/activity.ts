// Third-party
import * as moment from 'moment';

export class Activity {
    constructor(
        public duration: number = 0,
        public energyConsumption: number = 0,
        public met: number = 1,
        public name: string = '',
        public time: string = moment().format('HH:mm')
    ) { }
}

export class ActivityPlan {
    constructor(
        public activities: Activity[] = [],
        public combos: {
            energy: boolean,
            hiit: boolean,
            lowActivity: boolean,
            overtraining: boolean,
            sedentarism: boolean
        } = { energy: false, hiit: false, lowActivity: false, overtraining: false, sedentarism: true},
        public date: number = moment().dayOfYear(),
        public lifePoints: number = 0,
        public totalDuration: number = 0,
        public totalEnergyConsumption: number = 0,
        public weekLog: ExerciseLog[] = []
    ) { }
}

export class ExerciseLog {
    constructor(
        public date: string,
        public totalDuration: number = 0,
        public totalEnergyConsumption: number = 0
    ) { }
}