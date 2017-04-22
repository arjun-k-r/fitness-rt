export class Sleep {
    constructor(
        public bedTime: string = '',
        public electronics: boolean = true,
        public relax: boolean = false,
        public wakeUpTime: string = ''
    ) { }
}

export class SleepPlan {
    constructor(
        public bedTime: string = '10:00 pm',
        public respected: number = 0,
        public wakeUpTime: string = '05:30 am'
    ) { }
}