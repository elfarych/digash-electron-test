import { MenuComponent } from './menu.component';
import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[menuTrigger]',
  standalone: true,
})
export class MenuTriggerDirective {
  @Input('menuTrigger')
  public menuComponent: MenuComponent;

  @HostListener('click', ['$event'])
  public handleToggle(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.menuComponent.toggle();
  }
}
