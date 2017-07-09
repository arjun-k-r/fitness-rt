import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
@Injectable()
export class SearchPipe implements PipeTransform {

  /**
   * Filters items by their name
   */
  transform(items: Array<{ name: string }> = [], searchQuery: string = '') {
    let match: number = 0,
      tokens: Array<string> = [...searchQuery.split(' ').map((token: string) => token.trim().toLocaleLowerCase())];

    return (!!items && !!items.length) ? items.filter((item: { name: string }) => {
      match = 0;
      tokens.forEach((token: string) => {
        if (item.name.toLocaleLowerCase().includes(token)) {
          match++;
        }
      });

      return match === tokens.length;
    }) : [];
  }
}
