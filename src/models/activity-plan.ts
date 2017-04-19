/**
 * Class representing a performed activity
 * @class
 * @classdesc Representss the day to day performed physical or intelectual activities
 */
export class Activity {
    /**
     * @constructor
     * @param duration - The duration of activity
     * @param name - The name of activity
     * @param time - The time activity has started
     * @param type - The type of activity (mental or physical)
     */
    constructor(
        public duration: number,
        public name: string,
        public time: string,
        public type: string
    ) { }
}

/**
 * Class representing an activity plan
 * @class
 * @classdesc Schedules the time invested for different types of activities, such as work, physical, and intellectual exercise
 */
export class ActivityPlan {
    /**
     * @constructor
     * @param dailyDuration - The time invested in a specific type of activities every day in minutes
     * @param timesPerWeek - The number of days during the week a specific type of activities are maintained
     */
    constructor(
        public dailyDuration: number = 120,
        public timesPerWeek: number = 7
    ) { }
}