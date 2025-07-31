import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';

@Directive({
  selector: '[appScrollTopButton]',
  standalone: true,
})
export class ScrollTopButtonDirective implements AfterViewInit, OnDestroy {
  @Input() scrollThreshold = 300;
  @Input() rightOffset = 24;
  @Input() bottomOffset = 24;
  @Input() buttonClass = 'app-button-primary-sm';

  private readonly scrollElement: HTMLElement;
  private button: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
    this.scrollElement = this.el.nativeElement;
  }

  public ngAfterViewInit(): void {
    this.renderer.listen(this.scrollElement, 'scroll', this.onScroll);
  }

  public ngOnDestroy(): void {
    this.removeButton();
  }

  private onScroll = (): void => {
    const scrollTop = this.scrollElement.scrollTop;

    if (scrollTop > this.scrollThreshold) {
      if (!this.button) {
        this.createButton();
      }
    } else {
      this.removeButton();
    }
  };

  private createButton(): void {
    this.button = this.renderer.createElement('button');
    const iconSpan = this.renderer.createElement('span');

    this.renderer.addClass(iconSpan, 'pi');
    this.renderer.addClass(iconSpan, 'pi-arrow-up');
    this.renderer.addClass(this.button, this.buttonClass);

    this.renderer.appendChild(this.button, iconSpan);

    this.renderer.setStyle(this.button, 'position', 'absolute');
    this.renderer.setStyle(this.button, 'right', `${this.rightOffset}px`);
    this.renderer.setStyle(this.button, 'bottom', `${this.bottomOffset}px`);
    this.renderer.setStyle(this.button, 'z-index', '1000');

    this.renderer.listen(this.button, 'click', () => {
      this.scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
    });

    this.renderer.appendChild(this.scrollElement, this.button);
  }

  private removeButton(): void {
    if (this.button) {
      this.renderer.removeChild(this.scrollElement, this.button);
      this.button = null;
    }
  }
}
