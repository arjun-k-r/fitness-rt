export class ConstitutionQuiz {
    constructor(
        public kapha: DoshaQuiz = new DoshaQuiz(),
        public pitta: DoshaQuiz = new DoshaQuiz(),
        public vata: DoshaQuiz = new DoshaQuiz()
    ) { }
}

export class ConstitutionScore {
    constructor(
        public kapha: DoshaScore = new DoshaScore(),
        public pitta: DoshaScore = new DoshaScore(),
        public vata: DoshaScore = new DoshaScore()
    ) { }
}

export class DoshaQuiz {
    constructor(
        public physical: Array<DoshaQuizQuestion> = [],
        public psychological: Array<DoshaQuizQuestion> = []
    ) { }
}

export class DoshaQuizQuestion {
    constructor(
        public description: string,
        public selection: string
    ) { }
}

export class DoshaScore {
    constructor(
        public physical: Array<number> = [],
        public psychological: Array<number> = []
    ) { }
}