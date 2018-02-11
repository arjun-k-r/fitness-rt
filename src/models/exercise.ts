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

export interface IMuscleExercise {
    comments: string[];
    image: string;
    instructions: string[];
    muscles: string[];
    name: string;
    variations: string[];
    warning: string;
}

export interface IMuscleGroup {
    group: string;
    exercises: IMuscleExercise;
}