// Lodash
import * as _ from 'lodash';

// Models
import { ActivityPlan } from './activity-plan';
import { MealPlan } from './meal-plan';
import { Nutrition } from './nutrition';
import { Prakruti } from './prakruti';
import { SleepPlan } from './sleep-plan'

export class UserProfile {
    constructor(
        public activityPlan: ActivityPlan = new ActivityPlan(),
        public age: number = 0,
        public dosha: string = '',
        public gender: string = '',
        public height: number = 0,
        public imbalance: { kapha: boolean, pitta: boolean, vata: boolean } = {
            kapha: false,
            pitta: false,
            vata: false
        },
        public lactating: boolean = false,
        public mealPlan: MealPlan = new MealPlan(),
        public prakruti: Prakruti = new Prakruti(),
        public pregnant: boolean = false,
        public requirements: Nutrition = new Nutrition(),
        public sleepPlan: SleepPlan = new SleepPlan(),
        public weight: number = 0
    ) { }

    public setDosha(): void {
        let doshaPints: Array<{ name: string, value: number }> = _.sortBy([
            {
                name: 'Kapha',
                value: this.prakruti.kapha
            },
            {
                name: 'Pitta',
                value: this.prakruti.pitta
            },
            {
                name: 'Vata',
                value: this.prakruti.vata
            }
        ], item => item.value);

        // Return the most dominant dosha/doshas
        if (doshaPints[2].value - doshaPints[1].value <= 20 && doshaPints[2].value - doshaPints[0].value <= 20) {
            this.dosha = 'tridosha'
        } else if (doshaPints[2].value - doshaPints[1].value <= 20) {
            this.dosha = `${doshaPints[2].name}-${doshaPints[1].name}`
        } else {
            this.dosha = doshaPints[2].name;
        }
    }
}