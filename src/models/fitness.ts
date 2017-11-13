export class Fitness {
    constructor(
        public age: number = 0,
        public bmr: number = 0,
        public customRequirements: boolean = false,
        public gender: string = '',
        public height: number = 0,
        public lactating: boolean = false,
        public macronutrientRatios: MacronutrientRatios = new MacronutrientRatios(),
        public pregnant: boolean = false,
        public weight: number = 0
    ) { }
}

export class MacronutrientRatios {
    constructor(
        public carbohydrates: number = 33,
        public fats: number = 33,
        public protein: number = 33
    ) { }
}