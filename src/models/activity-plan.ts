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
    ) {}
}

export class Schedule {
    constructor(
        public monday: Array<Activity> = [],
        public tuesday: Array<Activity> = [],
        public wednessday: Array<Activity> = [],
        public thursday: Array<Activity> = [],
        public friday: Array<Activity> = [],
        public saturday: Array<Activity> = [],
        public sunday: Array<Activity> = []
    ) {}
}

export class ActivityPlan {
    constructor(
        public activitiesExtra: Array<Activity> = [],
        public schedule: Schedule = new Schedule()
    ) {}
}

