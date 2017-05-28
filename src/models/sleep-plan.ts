// Models
import { WarningMessage } from './warning-message';

export class SleepHabit {
    constructor(
        public bedTime: string = '22:00',
        public date: number = 0,
        public duration: number = 0,
        public wakeUpTime: string = '05:30'
    ) { }
}

export class SleepPlan {
    constructor(
        public daysOfImbalance: number = 0,
        public imbalancedSleep: boolean = false,
        public sleepOscillation: number = 0,
        public sleepPattern: Array<SleepHabit> = Array(7)
    ) { }
}