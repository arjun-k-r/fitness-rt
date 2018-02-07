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
    name: string;
    preparation: string;
    execution: string;
    utility: string;
    mechanics: string;
    force: string;
    target: string;
    synergists: string[];
    stabilizers: string[];
    source: string;
}

export interface IMuscle {
    name: string;
    exercises: IMuscleExercise;
}

export interface IMuscleGroup {
    group: string;
    muscles: IMuscle;
}