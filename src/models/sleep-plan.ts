export class SleepHabit {
    constructor(
        public preparation: { electronics: boolean, light: boolean, relaxation: boolean } = {
            electronics: false,
            light: false,
            relaxation: true
        },
        public refreshing: boolean = true,
    ) { }
}

export class SleepPlan {
    constructor(
        public schedule: {
            // Go to bed hour
            start: string,

            // Wake up hour
            stop: string
        } = {
            start: '21:30',
            stop: '05:00'
        },

        // Sleep monitoring
        public sleepHabits: Array<SleepHabit> = []
    ) { }
}