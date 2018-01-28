export class ActivityCategory {
    constructor(
        public activities: Activity[],
        public name: string
    ) {}
}

export class Activity {
    constructor(
        public duration: number,
        public energyBurn: number,
        public met: number,
        public name: string
    ) { }
}

export class Exercise {
    constructor(
        public activities: Activity[],
        public date: string,
        public duration: number,
        public energyBurn: number
    ) { }
}