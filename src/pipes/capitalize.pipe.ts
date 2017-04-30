import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
@Injectable()
export class CapitalizePipe implements PipeTransform {
  transform(value: string = '') {
    value = value + ''; // make sure it's a string
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
