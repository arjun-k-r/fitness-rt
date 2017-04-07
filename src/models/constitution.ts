export interface IConstitution {
    kapha: { physical: Array<string>; psychological: Array<string> };
    pitta: { physical: Array<string>; psychological: Array<string> };
    vata: { physical: Array<string>; psychological: Array<string> };
}

export interface IConstitutionQuiz {
    kapha: { physical: Array<number>; psychological: Array<number> };
    pitta: { physical: Array<number>; psychological: Array<number> };
    vata: { physical: Array<number>; psychological: Array<number> };
}