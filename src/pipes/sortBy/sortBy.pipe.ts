import { Pipe, PipeTransform } from '@angular/core';

// Third-party
import * as _ from 'lodash';

@Pipe({
  name: 'sortBy',
})
export class SortByPipe implements PipeTransform {
  /**
   * Sorts items by specific property
   */
  transform(items: Array<any> = [], sortBy: string = '', order: string = 'desc') {
    return !!sortBy ? _.orderBy(items, sortBy, order) : items;
  }
}
