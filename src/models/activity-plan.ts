// Third-party
import * as moment from 'moment';

export class Activity {
    constructor(
        public type: string,
        public duration: number = 0,
        public energyBurn: number = 0,
        public met: number = 1,
        public name: string = '',
        public time: string = moment().format('HH:mm')
    ) { }
}

export class ActivityPlan {
    constructor(
        public date: number = moment().dayOfYear(),
        public intellectualActivities: Array<Activity> = [],
        public intellectualEffort: number = 0,
        public intellectualInactivity: number = 0,
        public intellectualOverwork: number = 0,
        public physicalActivities: Array<Activity> = [],
        public physicalEffort: number = 0,
        public physicalInactivity: number = 0,
        public physicalOverwork: number = 0,
        public totalEnergyBurn: number = 0
    ) { }
}