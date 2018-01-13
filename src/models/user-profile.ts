export class Fitness {
  constructor(
      public bmr: number,
      public bodyFatPercentage: number,
      public waistChestRatio: number
  ) { }
}

export class UserProfile {
  constructor(
    public age: number,
    public fitness: Fitness,
    public gender: string,
    public height: number,
    public isLactating: boolean,
    public isPregnant: boolean,
    public weight: number
  ) { }
}