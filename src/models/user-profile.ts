// Lodash
import * as _ from 'lodash';

// Models
import { ActivityPlan } from './activity-plan';
import { MealPlan } from './meal-plan';
import { Prakruti } from './prakruti';
import { SleepPlan } from './sleep-plan'

export class UserProfile {
    constructor(
        public activityPlan: ActivityPlan = new ActivityPlan(),
        public age: number = 0,
        public gender: string = '',
        public height: number = 0,
        public imbalance: { kapha: boolean, pitta: boolean, vata: boolean } = {
            kapha: false,
            pitta: false,
            vata: false
        },
        public mealPlan: MealPlan = new MealPlan(),
        public prakruti: Prakruti = new Prakruti(),
        public sleepPlan: SleepPlan = new SleepPlan(),
        public weight: number = 0
    ) { }

    public getDosha(): string {
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
        if (doshaPints[2].value - doshaPints[1].value < 15 && doshaPints[1].value - doshaPints[0].value < 15) {
            return 'tridosha'
        } else if (doshaPints[2].value - doshaPints[1].value < 15) {
            return `${doshaPints[2].name}-${doshaPints[1].name}`
        } else {
            return doshaPints[2].name;
        }
    }
}