import { BodyFat } from './bodyFat';
import { Constitution } from './constitution';

export class BodyMeasurements {
  constructor(
    public chest: number,
    public height: number,
    public hips: number,
    public neck: number,
    public restingHeartRate: number,
    public waist: number,
    public weight: number
  ) { }
}

export class Fitness {
  constructor(
      public bmr: number,
      public bodyFatPercentage: BodyFat,
      public bodyShape: string,
      public heartRate: HeartRate,
      public idealWaist: string,
      public idealWeight: string,
  ) { }
}

export class FitnessTrend {
  constructor(
    public bodyFat: number,
    public chestMEasurement: number,
    public date: string,
    public heightMeasurement: number,
    public hipsMeasurement: number,
    public neckMeasurement: number,
    public restingHeartRateMeasurement: number,
    public waistMeasurement,
    public weightMeasurement: number
  ) {}
}

export class HeartRate {
  constructor(
    public max: number,
    public trainingMin: number,
    public trainingMax: number
  ) {}
}

export class UserProfile {
  constructor(
    public age: number,
    public constitution: Constitution,
    public fitness: Fitness,
    public gender: string,
    public isLactating: boolean,
    public isPregnant: boolean,
    public measurements: BodyMeasurements
  ) { }
}