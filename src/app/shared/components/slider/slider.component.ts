import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent implements AfterViewInit {
  @Input()
  public value: number = 1;

  @Input()
  public max: number = 1;

  @Input()
  public min: number = 0.1;

  @Input()
  public step: number = 0.1;

  @Output()
  public valueChanged: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('track', { static: true })
  private track!: ElementRef<HTMLDivElement>;

  private dragging = false;

  constructor(private cdr: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    this.value = this.clamp(this.value);
    this.cdr.markForCheck();
  }

  public get percent(): number {
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }

  public onPointerDown(event: PointerEvent): void {
    this.dragging = true;
    this.updateFromPointer(event);
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(ev: PointerEvent): void {
    if (this.dragging) this.updateFromPointer(ev);
  }

  @HostListener('pointerup')
  @HostListener('pointercancel')
  endDrag(): void {
    this.dragging = false;
  }

  private updateFromPointer(event: PointerEvent): void {
    const rect = this.track.nativeElement.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const raw = this.min + percent * (this.max - this.min);
    const stepped = Math.round(raw / this.step) * this.step;
    if (stepped > this.max || stepped < this.min) {
      this.dragging = false;
    }
    const next = this.clamp(stepped);

    if (next !== this.value) {
      this.value = next;
      this.valueChanged.emit(this.value);
      this.cdr.markForCheck();
    }
    event.preventDefault();
  }

  private clamp(v: number): number {
    return Math.min(this.max, Math.max(this.min, v));
  }
}
