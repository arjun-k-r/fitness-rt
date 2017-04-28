import { WarningMessage } from './warning-message';

/**
 * Class representing a single night's sleep
 * @class
 * @classdesc The sleep must be at tha same hour every night and there must be a before bed preparation routine for good sleep
 */
export class SleepHabit {
    /**
     * @constructor
     * @param {string} bedTime - The time a to go to sleep
     * @param {number} date - The day number of the performed sleep during the year
     * @param {boolean} noElectronics - Flag indicating if there was blue light exposure before bedtime
     * @param {boolean} noStimulants - Flag indicating if there were any stimulants (e.g. coffee, green/black tea, alcohol, tobacco) before bedtime
     * @param {boolean} relaxation - Flag indicating if there was relaxation before bed
     * @param {string} wakeUpTime - The time a to wake up
     * @param {Array} warnings - Warning message if the sleep is not healthy
     */
    constructor(
        public bedTime: string = '22:00',
        public date: number = 0,
        public noElectronics: boolean = false,
        public noStimulants: boolean = false,
        public relaxation: boolean = false,
        public wakeUpTime: string = '05:30',
        public warnings: Array<WarningMessage> = []
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
     * @param {number} notRefreshing - Counts the days of not refreshing sleep (electronics or stress before bed)
     * @param {number} poorSleep - Counts the days of insufficient sleep (less than 6 hours)
     * @param {number} sleepOscillation - The difference between the bedtime of the last 7 days sleep habits.
     * If it is grater than 1 or less than -1, the sleep has not been respected
     * @param {Array} sleepPattern - The last 7 days sleep habits
     */
    constructor(
        public notRefreshing: number = 0,
        public poorSleep: number = 0,
        public sleepOscillation: number = 0,
        public sleepPattern: Array<SleepHabit> = Array(7)
    ) { }
}