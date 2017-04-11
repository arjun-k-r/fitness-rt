export class Goal {
    constructor(
        public name: string = 'Sleep',
        public tasks: Array<Task> = []
    ) {}
}

export class Task {
    constructor(
        public descriptiion: string = '',
        public done: boolean = false
    ) {}
}