import { Pipe, PipeTransform } from '@angular/core';

// Third-party
import { orderBy } from 'lodash';

@Pipe({
  name: 'sort',
})
export class SortByPipe implements PipeTransform {
  /**
   * Sorts items by specific property
   */
  transform(items: Array<any> = [], sortBy: string = '', order: string = 'desc') {
    return !!sortBy ? orderBy(items, sortBy, order) : items;
  }
}
