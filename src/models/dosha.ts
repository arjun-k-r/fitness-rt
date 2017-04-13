export class Dosha {
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