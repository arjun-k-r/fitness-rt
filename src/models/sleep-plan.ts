import { WarningMessage } from './warning-message';

export class SleepHabit {
    constructor(
        public bedTime: string = '',
        public date: number = 0,
        public duration: number = 0,
        public wakeUpTime: string = '',
        public warnings: Array<WarningMessage> = []
    ) { }
}

export class SleepPlan {
    constructor(
        public daysOfImbalance: number = 0,
        public imbalancedSleep: boolean = false,
        public sleepOscillation: number = 0,
        public sleepPattern: Array<SleepHabit> = []
    ) { }
}