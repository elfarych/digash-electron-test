import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'readableSoundName',
})
export class ReadableSoundName implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'default':
        return 'Стандартный';
      case 'sound_2':
        return 'Звук 2';
      case 'sound_3':
        return 'Звук 3';
      case 'sound_4':
        return 'Звук 4';
      case 'sound_5':
        return 'Пикачу';
      case 'sound_6':
        return 'Звук 6';
      case 'sound_7':
        return 'Бруэ';
      default:
        return 'Стандартный';
    }
  }
}
