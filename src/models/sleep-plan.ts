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
            start: number,

            // Wake up hour
            stop: number
        } = {
            start: 9,
            stop: 5
        },

        // Sleep monitoring
        public sleepHabits: Array<SleepHabit> = []
    ) { }
}