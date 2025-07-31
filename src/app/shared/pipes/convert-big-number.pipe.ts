import { Pipe, PipeTransform } from '@angular/core';
import { convertNumber } from '../utils/convertNumber';

@Pipe({
  standalone: true,
  name: 'convertBigNumber',
})
export class ConvertBigNumberPipe implements PipeTransform {
  transform(value: number): string {
    return convertNumber(value);
  }
}
