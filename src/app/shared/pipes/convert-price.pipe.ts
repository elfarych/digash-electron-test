import { Pipe, PipeTransform } from '@angular/core';
import { convertPrice } from '../utils/convertPrice';

@Pipe({
  standalone: true,
  name: 'convertPrice',
})
export class ConvertPricePipe implements PipeTransform {
  transform(value: number): string {
    return convertPrice(value);
  }
}
