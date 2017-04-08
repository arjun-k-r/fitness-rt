export interface IConstitution {
    physical: Array<string>; 
    psychological: Array<string>
}

export interface IConstitutionScore {
    physical: Array<number>; 
    psychological: Array<number>
}

export interface IConstitutions {
    kapha: IConstitution;
    pitta: IConstitution;
    vata: IConstitution;
}

export interface IConstitutionQuiz {
    kapha: IConstitutionScore;
    pitta: IConstitutionScore;
    vata: IConstitutionScore;
}