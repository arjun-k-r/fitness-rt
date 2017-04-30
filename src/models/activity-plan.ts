// Third-party
import * as moment from 'moment';

/**
 * Class representing a performed activity
 * @class
 * @classdesc Representss the day to day performed physical or intelectual activities
 */
export class Activity {
    /**
     * @constructor
     * @param {number} duration - The duration of activity
     * @param {number} energyBurn - The energy burned during the activity
     * @param {number} met - The metabolic equivalent of the activity
     * @param {string} name - The name of activity
     * @param {string} time - The time activity has started
     * @param {string} type - The type of activity (intellectual or physical)
     */
    constructor(
        public type: string,
        public duration: number = 0,
        public energyBurn: number = 0,
        public met: number = 1,
        public name: string = '',
        public time: string = moment().format('HH:mm')
    ) { }
}

/**
 * Class representing an activity plan
 * @class
 * @classdesc Monitors the physical and intellectual activities in a single day
 */
export class ActivityPlan {
    /**
     * @constructor
     * @param {number} date - The date of the activity plan (the day number of the year)
     * @param {Array} intellectualActivities - Total intellectual activities performed per day
     * @param {number} intellectualEffort - The duration of intellectual exercise per day in minutes
     * @param {number} intellectualInactivity - Counts the days of intellectual inactivity
     * @param {number} intellectualOverwork - Counts the days of intellectual overwork
     * @param {Array} physicalActivities - Total intellectual activities performed per day
     * @param {number} physicalEffort - The duration of physical exercise per day in minutes
     * @param {number} physicalInactivity - Counts the days of physical inactivity
     * @param {number} physicalOverwork - Counts the days of physical overwork
     * @param {number} totalEnergyBurn - The energy in kilocalories burned per day
     */
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