/**
 * Class representing a performed activity
 * @class
 * @classdesc Representss the day to day performed physical or intelectual activities
 */
export class Activity {
    /**
     * @constructor
     * @param {number} duration - The duration of activity
     * @param {number} met - The metabolic equivalent of the activity
     * @param {string} name - The name of activity
     * @param {string} time - The time activity has started
     * @param {string} type - The type of activity (intellectual or physical)
     */
    constructor(
        public duration: number,
        public met: number,
        public name: string,
        public time: string,
        public type: string
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
     * @param {Array} activities - Total activities performed per day
     * @param {number} intellectualEffort - The duration of intellectual exercise per day in minutes
     * @param {number} physicalEffort - The duration of physical exercise per day in minutes
     */
    constructor(
        public activities: Array<Activity> = [],
        public intellectualEffort: number = 0,
        public physicalEffort: number = 0
    ) { }
}