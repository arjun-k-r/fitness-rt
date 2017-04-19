export class Constitution {
    constructor(
        public kapha: number = 0,
        public pitta: number = 0,
        public vata: number = 0
    ) { }
}

/**
 * Class representing a single characteristic option of a constitution quiz question
 * @class
 * @classdesc Each constitution quiz question has three options, each one representing a characteristic of a dosha
 */
export class ConstitutionQuizCharacterstic {
    /**
     * @constructor
     * @param checked - Flag indicating if the option is checked
     * @param description - The characteristic description
     * @param dosha - The dosha the characteristic describes
     */
    constructor(
        public checked: boolean,
        public description: string,
        public dosha: string
    ) {}
}

/**
 * Class representing a constitution quiz question
 * @class
 * @classdesc The constitution quiz contains questions with three single-choice options for each dosha
 */
export class ConstitutionQuizQuestion {
    /**
     * @constructor
     * @param characteristics - The three characteristic options for each dosha
     * @param observation - The physical, emotional, or mental pettern
     */
    constructor(
        public characteristics: Array<ConstitutionQuizCharacterstic>,
        public observation: string
    ) { }
}

/**
 * Class representing a dosha
 * @class
 * @classdesc In Ayurveda, there are three forces called doshas
 * that combine in different amount to form our unique physical, emotional, and mental constitution
 */
export class Dosha {
    /**
     * @constructor
     * @param balance - The factos that bring/keep the dosha in balance
     * @param characteristics - The characteristics the dosha manifests through
     * @param imbalanceFactors - The factos that increase the dosha energy
     * @param imbalanceSigns - The signs that indicate the dosha is increased
     * @param location - The location of the dosha in the body
     * @param management - The financial and organisational skills the dosha determines
     * @param occurence - The period of time the dosha is most abundant during the day, the year, and lifetime
     * @param overview - Biref summary about the dosha
     * @param physicalPatterns - The physical characteristics of the dosha
     * @param psychologicalPatterns - The mental characteristics of the dosha
     * @param qualities - The major qualities of the dosha
     * @param recommendations - Guidelines to keep the dosha in balance
     */
    constructor(
        public balance: string = '',
        public characteristics: string = '',
        public imbalanceFactors: string = '',
        public imbalanceSigns: string = '',
        public location: string = '',
        public management: string = '',
        public occurence: string = '',
        public overview: string = '',
        public physicalPatterns: string = '',
        public psychologicalPatterns: string = '',
        public qualities: string = '',
        public recommendations: Array<string> = []
    ) {}
}