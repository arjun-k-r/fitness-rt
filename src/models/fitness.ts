// Models
import { Nutrition } from './nutrition';

export class Fitness {
    constructor(
        public age: number = 0,
        public bmr: number = 1800,
        public bodyFat: number = 10,
        public gender: string = '',
        public heartRate: { max: number, resting: number, trainingMin: number, trainingMax: number } = {
            max: 0,
            resting: 0,
            trainingMin: 0,
            trainingMax: 0
        },
        public height: number = 0,
        public hips: number = 80,
        public lactating: boolean = false,
        public neck: number = 30,
        public pregnant: boolean = false,
        public requirements: Nutrition = new Nutrition(),
        public waist: number = 70,
        public weight: number = 0
    ) { }
}