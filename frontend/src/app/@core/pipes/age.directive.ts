import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'age'})
export class AgePipe implements PipeTransform {
  transform(date: Date, property: string): number {
    if (date) {
      const timeDiff = Math.abs(Date.now() - new Date(date).getTime());
      // Used Math.floor instead of Math.ceil
      // so 26 years and 140 days would be considered as 26, not 27.
      return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    } else {
      return 0;
    }
  }
}
