import { Pipe, PipeTransform } from '@angular/core';

// Third-party
import { orderBy } from 'lodash';

@Pipe({
  name: 'sort',
})
export class SortByPipe implements PipeTransform {

  transform(items: any[] = [], sortBy: string = '', order: string = 'desc'): any[] {
    return !!sortBy ? orderBy(items, sortBy, order) : items;
  }
}
