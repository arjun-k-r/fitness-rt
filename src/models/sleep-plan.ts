/**
 * Class representing a single night's sleep
 * @class
 * @classdesc The sleep must be at tha same hour every night and there must be a before bed preparation routine for good sleep
 */
export class SleepHabit {
    /**
     * @constructor
     * @param {string} bedTime - The time a to go to sleep
     * @param {boolean} noElectronics - Flag indicating if there was blue light exposure before bed
     * @param {boolean} relaxation - Flag indicating if there was relaxation before bed
     * @param {string} wakeUpTime The time a to wake up
     */
    constructor(
        public bedTime: string = '',
        public noElectronics: boolean = true,
        public relaxation: boolean = false,
        public wakeUpTime: string = ''
    ) { }
}

/**
 * Class representing a sleep routine
 * @class
 * @classdesc We need to have proper and a stable sleep patterns for good health
 */
export class SleepPlan {
    /**
     * @constructor
     * @param {string} bedTime - The time a to go to sleep
     * @param {number} sleepOscillation - The difference between the bedtime of the last 7 days sleep habits.
     * If it is grater than 1 or less than -1, the sleep has not been respected
     * @param {Array} sleepPattern - The last 7 days sleep habits
     * @param {string} wakeUpTime The time a to wake up
     */
    constructor(
        public bedTime: string = '',
        public sleepOscillation: number = 0,
        public sleepPattern: Array<SleepHabit> = Array(7),
        public wakeUpTime: string = ''
    ) { }
}