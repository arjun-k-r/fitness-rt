export class Activity {
    constructor(
        // Duration of activity
        public duration: number,

        // Name of activity
        public name: string,

        // Time activity has started
        public time: string,

        // Intellectual or physical
        public type: string
    ) { }
}

export class ActivityPlan {
    constructor(
        public activities: Array<Activity> = [],
        public workout: Workout = new Workout(30, 'Calisthenics', '08:30', 'Strength', false)
    ) { }
}

export class ActivitySchedule {
    constructor(
        public monday: ActivityPlan = new ActivityPlan(),
        public tuesday: ActivityPlan = new ActivityPlan(),
        public wednesday: ActivityPlan = new ActivityPlan(),
        public thursday: ActivityPlan = new ActivityPlan(),
        public friday: ActivityPlan = new ActivityPlan(),
        public saturday: ActivityPlan = new ActivityPlan(),
        public sunday: ActivityPlan = new ActivityPlan()
    ) { }
}

export class Workout extends Activity {
    constructor(
        // Duration of activity
        public duration: number,

        // Name of activity
        public name: string,

        // Time activity has started
        public time: string,

        // Intellectual or physical
        public type: string,

        // Indicates if workout is perfoermed in a day
        public performed: boolean
    ) {
        super(duration, name, time, type);
    }
}

