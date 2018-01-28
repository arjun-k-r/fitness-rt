import { Pipe, PipeTransform } from '@angular/core';

// Models
import { ActivityCategory, Activity } from '../../models';

@Pipe({
  name: 'activityFilter',
})
export class ActivityFilterPipe implements PipeTransform {

  transform(activities: ActivityCategory[] = [], query: string = ''): any[] {
    return activities.filter((ac: ActivityCategory) => {
      let match: boolean = false;
      if (ac.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())) {
        return true;
      } else {
        ac.activities.forEach((a: Activity) => {
          if (a.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())) {
            match = true;
          }
        });
        return match;
      }
    }).map((ac: ActivityCategory) => {
      return {
        name: ac.name,
        activities: ac.activities.filter((a: Activity) => {
          if (a.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())) {
            return true;
          }
          return false;
        })
      }
    });
  }
}
