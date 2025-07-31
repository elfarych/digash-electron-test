import {Directive, HostListener, QueryList} from "@angular/core";
import {NightVision} from "night-vision";
import {DrawingToolbarItem, DrawingToolType, getDrawingToolbarItems} from "../../../models/DrawingTool";

@Directive()
export abstract class ChartDrawingToolsComponent {
  public chartInstanceComponents!: QueryList<{getChart(): NightVision}>;

  public activeDrawingTool: DrawingToolType = 'Cursor';
  public magnetIsActive: boolean = false;
  public toolbarTools: DrawingToolbarItem[] = getDrawingToolbarItems();

  @HostListener('document:keydown.escape', ['$event'])
  public handleEscapeClick(event: MouseEvent) {
    this.activateDrawingTool({type: 'Cursor', label: '', icon: ''});
  }

  public drawingToolChange(type: DrawingToolType): void {
    this.activeDrawingTool = type;
  }

  public activateDrawingTool(data: DrawingToolbarItem): void {
    if (data.type === 'Magnet' && this.activeDrawingTool === 'Magnet') {
      this.activeDrawingTool = 'Cursor';
      this.magnetIsActive = false;
    } else {
      this.activeDrawingTool = data.type;
      this.magnetIsActive = data.type === 'Magnet';
    }

    for (const chartInstanceComponent of this.chartInstanceComponents) {
      if (data.type === 'Trash') {
        chartInstanceComponent.getChart()?.events.emit('remove-all-tools', {});
        this.activeDrawingTool = 'Cursor';
        continue;
      }
      chartInstanceComponent.getChart()?.events.emit('tool-selected', data);
    }
  }
}
