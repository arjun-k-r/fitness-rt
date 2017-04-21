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
     * @param dailyExercise - The duration of physical exercise per day in minutes
     * @param weeklyIntenseExercise - The number of days during the week of performed intense exercise
     */
    constructor(
        public dailyExercise: number = 120,
        public weeklyIntenseExercise: number = 7
    ) { }
}