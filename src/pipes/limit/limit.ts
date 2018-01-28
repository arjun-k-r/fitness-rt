import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limit',
})
export class LimitPipe implements PipeTransform {

  transform(items: any[] = [], limit: number = Number.MAX_SAFE_INTEGER): any[] {
    return (!!items && !!items.length) ? items.filter((item: any, idx: number) => idx <= limit) : [];
  }
}
