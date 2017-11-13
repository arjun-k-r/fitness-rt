// Third-party
import * as moment from 'moment';

export class Sleep {
    constructor(
        public bedTime: string = moment().format('HH:mm'),
        public date: number = moment().dayOfYear(),
        public duration: number = 0,
        public quality: number = 0
    ) { }
}