import {Pipe, PipeTransform} from "@angular/core";
import {normalizeCoinQuoteSymbol} from "../utils/normalizeCoinQuoteSymbol";

@Pipe({
  standalone: true,
  name: 'symbolNormalize',
})
export class SymbolPipe implements PipeTransform {
  public transform(value: string): string {
    return normalizeCoinQuoteSymbol(value);
  }
}
