import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
@Injectable()
export class SearchPipe implements PipeTransform {

  transform(value: { name: string }[], searchQuery: string = '', limit: number = Number.MAX_SAFE_INTEGER) {
    return value ? value.filter((item: { name: string }, idx: number) => item.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) && idx < limit) : [];
  }
}
