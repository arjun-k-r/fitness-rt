export class Sleep {
    constructor(
        public bedTime: string = '10:00',
        public electronics: boolean = true,
        public relax: boolean = false,
        public wakeUpTime: string = '05:30'
    ) { }
}

export class SleepPlan {
    constructor(
        public bedTime: string = '10:00',
        public respected: number = 0,
        public wakeUpTime: string = '05:30'
    ) { }
}