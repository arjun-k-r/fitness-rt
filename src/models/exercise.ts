export class ActivityCategory {
    constructor(
        public activities: Activity[],
        public name: string
    ) { }
}

export class Activity {
    constructor(
        public category: string,
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
        public energyBurn: number,
        public notes: string
    ) { }
}

export class MuscleExercise {
    constructor(
        public comments: string[] = [],
        public image: string = '',
        public instructions: string[] = [],
        public muscles: string[] = [],
        public name: string = '',
        public variations: string[] = [],
        public warning: string = ''
    ) { }
}

export interface IMuscleGroup {
    group: string;
    exercises: MuscleExercise[];
}