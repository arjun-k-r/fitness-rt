// Third-party
import * as moment from 'moment';

export class ActivityCategory {
    constructor(
        public category: string,
        public icon: string,
        public types: ActivityType[]
    ) {}
}

export class ActivityType {
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
        public activities: ActivityType[] = [],
        public date: number = moment().dayOfYear(),
        public totalDuration: number = 0,
        public totalEnergyConsumption: number = 0
    ) { }
}

export class ExerciseLog {
    constructor(
        public date: string,
        public totalDuration: number = 0,
        public totalEnergyConsumption: number = 0
    ) { }
}