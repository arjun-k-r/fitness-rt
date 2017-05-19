import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
@Injectable()
export class SearchPipe implements PipeTransform {

  /**
   * Filters items by their name and limits their number
   */
  transform(items: Array<{ name: string }> = [], searchQuery: string = '', limit: number = Number.MAX_SAFE_INTEGER) {
    return (!!items && !!items.length) ? items.filter((item: { name: string }, idx: number) => item.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) && idx < limit) : [];
  }
}
