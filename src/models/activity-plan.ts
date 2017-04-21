/**
 * Class representing a performed activity
 * @class
 * @classdesc Representss the day to day performed physical or intelectual activities
 */
export class Activity {
    /**
     * @constructor
     * @param {number} duration - The duration of activity
     * @param {string} name - The name of activity
     * @param {string} time - The time activity has started
     * @param {string} type - The type of activity (mental or physical)
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
     * @param {number} dailyExercise - The duration of physical exercise per day in minutes
     * @param {number} dailyStudying - The duration of intellectual exercise per day in minutes
     * @param {number} weeklyIntenseExercise - The number of days during the week of performed intense exercise
     */
    constructor(
        public dailyExercise: number = 240,
        public dailyStudying: number = 240,
        public weeklyIntenseExercise: number = 7
    ) { }
}