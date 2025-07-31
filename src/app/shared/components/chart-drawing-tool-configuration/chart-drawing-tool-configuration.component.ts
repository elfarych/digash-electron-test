import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseDrawingTool } from '../../models/DrawingTool';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { ColorPickerModule } from 'primeng/colorpicker';

type DropdownOption = { value: number | string; label?: string };

export const POSITION_LEFT_KEY = 'digash-drawing-tool-position-left';
export const POSITION_TOP_KEY = 'digash-drawing-tool-position-top';

@Component({
  selector: 'app-chart-drawing-tool-configuration',
  standalone: true,
  imports: [
    CommonModule,
    CdkDrag,
    CdkDragHandle,
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
    TranslateModule,
    SvgIconComponent,
    ColorPickerModule,
  ],
  templateUrl: './chart-drawing-tool-configuration.component.html',
  styleUrls: ['./chart-drawing-tool-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartDrawingToolConfigurationComponent implements OnInit {
  @Input()
  public tool: BaseDrawingTool;

  @Output()
  public configChange = new EventEmitter<BaseDrawingTool>();

  @Output()
  public handleRemove: EventEmitter<BaseDrawingTool> =
    new EventEmitter<BaseDrawingTool>();

  @ViewChild('dragElement')
  public dragElement: ElementRef;

  public positionTop: number = 20;
  public positionLeft: number = 20;

  constructor(private cdr: ChangeDetectorRef) {}

  public lineWidthOptions: DropdownOption[] = [
    { value: 1, label: '1px' },
    { value: 2, label: '2px' },
    { value: 3, label: '3px' },
    { value: 4, label: '4px' },
  ];

  public lineTypeOptions: DropdownOption[] = [
    { value: 'solid', label: '' },
    { value: 'dashed', label: '' },
    { value: 'dotted', label: '' },
  ];

  public ngOnInit(): void {
    this.setDrawingToolPosition();
    if (!this.tool.lineType) {
      this.tool.lineType = 'solid';
    }
  }

  public showLineColor(component: any): void {
    component.click();
  }

  public showFillColor(component: any): void {
    component.click();
  }

  public updateLineType({ value }: DropdownOption) {
    if (this.tool) {
      this.tool.lineType = value as string;
      this.configChange.emit(this.tool);
    }
  }

  public updateLineWidth({ value }: DropdownOption) {
    if (this.tool) {
      this.tool.lineWidth = value as number;
      this.configChange.emit(this.tool);
    }
  }

  public updateConfig(): void {
    if (this.tool) {
      this.configChange.emit(this.tool);
    }
  }

  public remove(): void {
    this.handleRemove.emit(this.tool);
  }

  public dragUpdate(data): void {
    const positionLeft =
      data.distance.x + this.dragElement.nativeElement.offsetLeft;
    const positionTop =
      data.distance.y + this.dragElement.nativeElement.offsetTop;

    localStorage.setItem(POSITION_LEFT_KEY, positionLeft.toString());
    localStorage.setItem(POSITION_TOP_KEY, positionTop.toString());
  }

  private setDrawingToolPosition(): void {
    this.positionLeft = Math.max(
      parseInt(localStorage.getItem(POSITION_LEFT_KEY) ?? '0'),
      0,
    );
    this.positionTop = Math.max(
      parseInt(localStorage.getItem(POSITION_TOP_KEY) ?? '0'),
      0,
    );
  }
}
