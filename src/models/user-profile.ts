import { BodyFat } from './bodyFat';

export class Fitness {
  constructor(
      public bmr: number,
      public bodyFatPercentage: BodyFat,
      public bodyShape: string
  ) { }
}

export class BodyMeasurements {
  constructor(
    public chest: number,
    public height: number,
    public hips: number,
    public neck: number,
    public waist: number,
    public weight: number
  ) { }
}

export class UserProfile {
  constructor(
    public age: number,
    public fitness: Fitness,
    public gender: string,
    public isLactating: boolean,
    public isPregnant: boolean,
    public measurements: BodyMeasurements
  ) { }
}