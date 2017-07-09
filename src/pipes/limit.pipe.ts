import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limit',
})
export class LimitPipe implements PipeTransform {
  /**
   * Limits the items
   */
  transform(items: Array<any> = [], limit: number = Number.MAX_SAFE_INTEGER) {
    return (!!items && !!items.length) ? items.filter((item: any, idx: number) => idx <= limit) : [];
  }
}
