import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appColorPicker]',
  standalone: true,
})
export class ColorPickerDirective implements OnChanges, OnInit {
  @Input()
  public color: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  public ngOnInit() {
    this.setBackgroundColor(this.color);
  }

  public ngOnChanges({ color }: SimpleChanges) {
    if (color) this.setBackgroundColor(color.currentValue);
  }

  private setBackgroundColor(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }
}
