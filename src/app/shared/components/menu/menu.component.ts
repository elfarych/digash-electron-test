import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements AfterViewInit, OnDestroy {
  @HostBinding('class.opened')
  private opened = false;

  @Output()
  public handleOpenMenu: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  public hostElement: HTMLElement;

  private resizeObserver: ResizeObserver;

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngAfterViewInit(): void {
    if (this.hostElement) {
      this.resizeObserver = new ResizeObserver((entries) => {
        this.elementRef.nativeElement.style.position = 'fixed';
        this.elementRef.nativeElement.style.right = 'auto';
        this.elementRef.nativeElement.style.width = `${this.hostElement.offsetWidth}px`;
      });

      this.resizeObserver.observe(this.hostElement);
    }
  }

  public ngOnDestroy(): void {
    this.resizeObserver?.unobserve(this.hostElement);
  }

  public toggle(): void {
    this.opened = !this.opened;
    this.cdr.detectChanges();

    this.handleOpenMenu.emit();
  }

  public getOpened(): boolean {
    return this.opened;
  }

  public close(): void {
    this.opened = false;
    this.cdr.detectChanges();
  }

  @HostListener('document:mousedown', ['$event'])
  public handleClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
