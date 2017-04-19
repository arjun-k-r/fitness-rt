// Models
import { ActivityPlan } from './activity-plan';
import { Constitution } from './constitution';
import { MealPlan } from './meal-plan';
import { Nutrition } from './nutrition';
import { SleepPlan } from './sleep-plan'

export class UserProfile {
    constructor(
        public activityPlan: ActivityPlan = new ActivityPlan(),
        public age: number = 0,
        public bmr: number = 1800,
        public bodyFat: number = 10,
        public constitution: Constitution = new Constitution(),
        public dosha: string = 'Vata',
        public gender: string = '',
        public height: number = 0,
        public hips: number = 80,
        public imbalance: { kapha: boolean, pitta: boolean, vata: boolean } = {
            kapha: false,
            pitta: false,
            vata: false
        },
        public lactating: boolean = false,
        public mealPlan: MealPlan = new MealPlan(),
        public neck: number = 30,
        public pregnant: boolean = false,
        public requirements: Nutrition = new Nutrition(),
        public sleepPlan: SleepPlan = new SleepPlan(),
        public waist: number = 70,
        public weight: number = 0
    ) { }
}