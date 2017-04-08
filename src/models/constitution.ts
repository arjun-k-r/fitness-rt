export class ConstitutionQuiz {
    constructor(
        public kapha: ConstitutionScore = new ConstitutionScore(),
        public pitta: ConstitutionScore = new ConstitutionScore(),
        public vata: ConstitutionScore = new ConstitutionScore()
    ) { }
}

export class ConstitutionScore {
    constructor(
        public physical: Array<number> = [],
        public psychological: Array<number> = []
    ) { }
}

export interface IConstitution {
    physical: Array<string>;
    psychological: Array<string>
}

export interface IConstitutions {
    kapha: IConstitution;
    pitta: IConstitution;
    vata: IConstitution;
}