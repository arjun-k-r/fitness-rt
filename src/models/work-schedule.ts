export class Job {
    constructor(
        public duration: number = 8,
        public time: string = '08:00',
    ) { }
}

export class WorkSchedule {
    constructor(
        public monday: Array<Job> = [],
        public tuesday: Array<Job> = [],
        public wednesday: Array<Job> = [],
        public thursday: Array<Job> = [],
        public friday: Array<Job> = [],
        public saturday: Array<Job> = [],
        public sunday: Array<Job> = []
    ) { }

}