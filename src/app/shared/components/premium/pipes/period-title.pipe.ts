import {Pipe, PipeTransform} from '@angular/core';
import {PremiumPeriod} from "../../../models/PremiumPeriod";

@Pipe({
  name: 'periodTitle',
  standalone: true
})
export class PeriodTitlePipe implements PipeTransform {
  public transform(value: PremiumPeriod, ...args: unknown[]): string {
    switch (value) {
      case "month":
        return "Премиум на 1 месяц";
      case "3month":
        return "Премиум на 3 месяца";
      case "6month":
        return "Премиум на 6 месяцев";
      case "12month":
        return "Премиум на 1 год";
    }

    return "Период не выбран";
  }
}
