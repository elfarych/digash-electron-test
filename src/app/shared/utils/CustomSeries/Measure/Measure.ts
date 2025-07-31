import { CanvasRenderingTarget2D } from 'fancy-canvas';
import {
  Coordinate,
  IChartApi,
  isBusinessDay,
  ISeriesApi,
  ISeriesPrimitiveAxisView,
  ISeriesPrimitivePaneRenderer,
  ISeriesPrimitivePaneView,
  MouseEventParams,
  SeriesPrimitivePaneViewZOrder,
  SeriesType,
  Time,
} from 'lightweight-charts';
import { PluginBase } from '../PluginBase';
import { ensureDefined } from '../assertions';
import { positionsBox } from '../positions';
import { CandlestickVisualization } from '../../../models/Candlestick';

class RectanglePaneRenderer implements ISeriesPrimitivePaneRenderer {
  _p1: ViewPoint;
  _p2: ViewPoint;
  _fillColor: string;
  _source: Rectangle;

  constructor(
    p1: ViewPoint,
    p2: ViewPoint,
    source: Rectangle,
    fillColor: string,
  ) {
    this._p1 = p1;
    this._p2 = p2;
    this._fillColor = fillColor;
    this._source = source;
  }

  draw(target: CanvasRenderingTarget2D) {
    target.useBitmapCoordinateSpace((scope) => {
      if (
        this._p1.x === null ||
        this._p1.y === null ||
        this._p2.x === null ||
        this._p2.y === null
      )
        return;
      const ctx = scope.context;
      const horizontalPositions = positionsBox(
        this._p1.x,
        this._p2.x,
        scope.horizontalPixelRatio,
      );
      const verticalPositions = positionsBox(
        this._p1.y,
        this._p2.y,
        scope.verticalPixelRatio,
      );
      ctx.fillStyle = this._fillColor;
      ctx.fillRect(
        horizontalPositions.position,
        verticalPositions.position,
        horizontalPositions.length,
        verticalPositions.length,
      );
      this.drawTooltip(scope, ctx);
    });
  }

  drawTooltip(scope, ctx) {
    const horizontalPositions = positionsBox(
      this._p1.x,
      this._p2.x,
      scope.horizontalPixelRatio,
    );
    const verticalPositions = positionsBox(
      this._p1.y,
      this._p2.y,
      scope.verticalPixelRatio,
    );

    const text1 = `${(this._source._p2.price - this._source._p1.price).toFixed(3)} (${this.calculateDistance(this._source._p1.price, this._source._p2.price)}%)`;
    const text2 = `${this.timeText()}`;
    const text3 = `${this.volumeText()}`;
    const text = `${text1}\n${text2}`;
    const textWidth = ctx.measureText(text).width;

    const padding = 10;
    const mainRectCenterX =
      horizontalPositions.position + horizontalPositions.length / 2;
    const roundRectX = mainRectCenterX - textWidth / 2 - padding;
    const roundRectWidth = textWidth + 2 * padding;
    const roundRectHeight = 60; // adjust as needed
    // const roundRectY = percent() > 0 ? Math.min(y1, y2) - roundRectHeight - padding : Math.max(y1, y2) + padding;
    const roundRectY = verticalPositions.position - roundRectHeight - padding;
    const roundRectRadius = 5; // adjust as needed
    ctx.fillStyle = this._fillColor.replace(/[^,]+(?=\))/, '.9');
    ctx.roundRect(
      roundRectX,
      roundRectY,
      roundRectWidth,
      roundRectHeight,
      roundRectRadius,
    );

    ctx.fill();
    // ctx.stroke();

    ctx.fillStyle = '#ffffffcc'; // color;
    ctx.font =
      '11px -apple-system,BlinkMacSystemFont,\n    Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,\n    Fira Sans,Droid Sans,Helvetica Neue,\n    sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      text1,
      roundRectX + roundRectWidth / 2,
      roundRectY + roundRectHeight / 4,
    );
    ctx.fillText(
      text2,
      roundRectX + roundRectWidth / 2,
      roundRectY + (2 * roundRectHeight) / 4,
    );
    ctx.fillText(
      text3,
      roundRectX + roundRectWidth / 2,
      roundRectY + (3 * roundRectHeight) / 4,
    );
  }

  calculateDistance(y1: number, y2: number): string {
    return Math.abs((100 / y1) * (y2 - y1)).toFixed(2);
  }

  volumeText(): string {
    const data = this._source._data;
    const p1TimeIdx = data.findIndex(
      ({ time }) => this._source._p1.time === time,
    );
    const p2TimeIdx = data.findIndex(
      ({ time }) => this._source._p2.time === time,
    );
    const startIdx = Math.min(p1TimeIdx, p2TimeIdx);
    const endIdx = Math.max(p1TimeIdx, p2TimeIdx);

    let volume = 0;
    for (let i = startIdx; i <= endIdx; i++) {
      volume += data[i].volume * data[i].close;
    }

    const formatter = Intl.NumberFormat('en', { notation: 'compact' });
    return `Объем ${formatter.format(volume)}$`;
  }

  timeText() {
    let deltaTimeMs =
      (this._source._p2.time as number) * 1000 -
      (this._source._p1.time as number) * 1000;
    const timeFrameMs = 60000;

    const negative = deltaTimeMs < 0;
    deltaTimeMs = Math.abs(deltaTimeMs);

    const minutes = Math.floor((deltaTimeMs / (1000 * 60)) % 60);
    const hours = Math.floor((deltaTimeMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(deltaTimeMs / (1000 * 60 * 60 * 24));

    let result = '';
    if (days > 0) {
      result += days + 'д ';
    }
    if ((hours > 0 || days > 0) && hours !== 0) {
      result += hours + 'ч ';
    }
    if (minutes > 0 && timeFrameMs < 60 * 60 * 1000 && minutes !== 0) {
      result += minutes + 'м';
    }

    const data = this._source._data;
    const p1TimeIdx = data.findIndex(
      ({ time }) => this._source._p1.time === time,
    );
    const p2TimeIdx = data.findIndex(
      ({ time }) => this._source._p2.time === time,
    );
    const startIdx = Math.min(p1TimeIdx, p2TimeIdx);
    const endIdx = Math.max(p1TimeIdx, p2TimeIdx);

    return `Бары: ${endIdx - startIdx}, ${(negative ? '-' : '') + result.trim()}`;
  }
}

interface ViewPoint {
  x: Coordinate | null;
  y: Coordinate | null;
}

class RectanglePaneView implements ISeriesPrimitivePaneView {
  _source: Rectangle;
  _p1: ViewPoint = { x: null, y: null };
  _p2: ViewPoint = { x: null, y: null };

  constructor(source: Rectangle) {
    this._source = source;
  }

  update() {
    const series = this._source.series;
    const y1 = series.priceToCoordinate(this._source._p1.price);
    const y2 = series.priceToCoordinate(this._source._p2.price);
    const timeScale = this._source.chart.timeScale();
    const x1 = timeScale.timeToCoordinate(this._source._p1.time);
    const x2 = timeScale.timeToCoordinate(this._source._p2.time);
    this._p1 = { x: x1, y: y1 };
    this._p2 = { x: x2, y: y2 };
  }

  renderer() {
    return new RectanglePaneRenderer(
      this._p1,
      this._p2,
      this._source,
      this._p1.y > this._p2.y
        ? this._source._options.fillColorUp
        : this._source._options.fillColorDown,
    );
  }
}

class RectangleAxisPaneRenderer implements ISeriesPrimitivePaneRenderer {
  _p1: number | null;
  _p2: number | null;
  _fillColor: string;
  _vertical = false;

  constructor(
    p1: number | null,
    p2: number | null,
    fillColor: string,
    vertical: boolean,
  ) {
    this._p1 = p1;
    this._p2 = p2;
    this._fillColor = fillColor;
    this._vertical = vertical;
  }

  draw(target: CanvasRenderingTarget2D) {
    target.useBitmapCoordinateSpace((scope) => {
      if (this._p1 === null || this._p2 === null) return;
      const ctx = scope.context;
      ctx.globalAlpha = 0.5;
      const positions = positionsBox(
        this._p1,
        this._p2,
        this._vertical ? scope.verticalPixelRatio : scope.horizontalPixelRatio,
      );
      ctx.fillStyle = this._fillColor;
      if (this._vertical) {
        ctx.fillRect(0, positions.position, 15, positions.length);
      } else {
        ctx.fillRect(positions.position, 0, positions.length, 15);
      }
    });
  }
}

abstract class RectangleAxisPaneView implements ISeriesPrimitivePaneView {
  _source: Rectangle;
  _p1: number | null = null;
  _p2: number | null = null;
  _vertical = false;
  _y1: number | null = null;
  _y2: number | null = null;

  constructor(source: Rectangle, vertical: boolean) {
    this._source = source;
    this._vertical = vertical;
  }

  abstract getPoints(): [Coordinate | null, Coordinate | null];

  abstract getYPoints(): [Coordinate | null, Coordinate | null];

  update() {
    [this._p1, this._p2] = this.getPoints();
    [this._y1, this._y2] = this.getYPoints();
  }

  renderer() {
    return new RectangleAxisPaneRenderer(
      this._p1,
      this._p2,
      this._y1 > this._y2
        ? this._source._options.fillColorUp
        : this._source._options.fillColorDown,
      this._vertical,
    );
  }

  zOrder(): SeriesPrimitivePaneViewZOrder {
    return 'bottom';
  }
}

class RectanglePriceAxisPaneView extends RectangleAxisPaneView {
  getPoints(): [Coordinate | null, Coordinate | null] {
    const series = this._source.series;
    const y1 = series.priceToCoordinate(this._source._p1.price);
    const y2 = series.priceToCoordinate(this._source._p2.price);
    return [y1, y2];
  }

  getYPoints(): [Coordinate | null, Coordinate | null] {
    return this.getPoints();
  }
}

class RectangleTimeAxisPaneView extends RectangleAxisPaneView {
  getPoints(): [Coordinate | null, Coordinate | null] {
    const timeScale = this._source.chart.timeScale();
    const x1 = timeScale.timeToCoordinate(this._source._p1.time);
    const x2 = timeScale.timeToCoordinate(this._source._p2.time);
    return [x1, x2];
  }

  getYPoints(): [Coordinate | null, Coordinate | null] {
    const series = this._source.series;
    const y1 = series.priceToCoordinate(this._source._p1.price);
    const y2 = series.priceToCoordinate(this._source._p2.price);
    return [y1, y2];
  }
}

abstract class RectangleAxisView implements ISeriesPrimitiveAxisView {
  _source: Rectangle;
  _p: Point;
  _pos: Coordinate | null = null;

  constructor(source: Rectangle, p: Point) {
    this._source = source;
    this._p = p;
  }

  abstract update(): void;

  abstract text(): string;

  coordinate() {
    return this._pos ?? -1;
  }

  visible(): boolean {
    return this._source._options.showLabels;
  }

  tickVisible(): boolean {
    return this._source._options.showLabels;
  }

  textColor() {
    return this._source._options.labelTextColor;
  }

  backColor() {
    return this._source._options.labelColorUp;
  }

  movePoint(p: Point) {
    this._p = p;
    this.update();
  }
}

class RectangleTimeAxisView extends RectangleAxisView {
  update() {
    const timeScale = this._source.chart.timeScale();
    this._pos = timeScale.timeToCoordinate(this._p.time);
  }

  text() {
    return this._source._options.timeLabelFormatter(this._p.time);
  }
}

class RectanglePriceAxisView extends RectangleAxisView {
  update() {
    const series = this._source.series;
    this._pos = series.priceToCoordinate(this._p.price);
  }

  text() {
    return this._source._options.priceLabelFormatter(this._p.price);
  }
}

interface Point {
  time: Time;
  price: number;
}

export interface RectangleDrawingToolOptions {
  fillColorUp: string;
  previewFillColorUp: string;
  labelColorUp: string;
  fillColorDown: string;
  previewFillColorDown: string;
  labelColorDown: string;
  labelTextColor: string;
  showLabels: boolean;
  priceLabelFormatter: (price: number) => string;
  timeLabelFormatter: (time: Time) => string;
}

const defaultOptions: RectangleDrawingToolOptions = {
  fillColorUp: 'rgba(41, 98, 255, 0.2)',
  previewFillColorUp: 'rgba(41, 98, 255,0.25)',
  labelColorUp: 'rgba(41, 98, 255, 1)',
  fillColorDown: 'rgba(255, 82, 82, 0.25)',
  previewFillColorDown: 'rgba(255, 82, 82,0.25)',
  labelColorDown: 'rgba(255, 82, 82, 1)',

  labelTextColor: '#fff',
  showLabels: true,
  priceLabelFormatter: (price: number) => price.toFixed(2),
  timeLabelFormatter: (time: Time) => {
    if (typeof time == 'string') return time;
    const date = isBusinessDay(time)
      ? new Date(time.year, time.month, time.day)
      : new Date(time * 1000);
    return date.toLocaleDateString();
  },
};

class Rectangle extends PluginBase {
  _options: RectangleDrawingToolOptions;
  _p1: Point;
  _p2: Point;
  _paneViews: RectanglePaneView[];
  _timeAxisViews: RectangleTimeAxisView[];
  _priceAxisViews: RectanglePriceAxisView[];
  _priceAxisPaneViews: RectanglePriceAxisPaneView[];
  _timeAxisPaneViews: RectangleTimeAxisPaneView[];
  _data: CandlestickVisualization[] = [];

  constructor(
    p1: Point,
    p2: Point,
    data: CandlestickVisualization[],
    options: Partial<RectangleDrawingToolOptions> = {},
  ) {
    super();
    this._data = data;
    this._p1 = p1;
    this._p2 = p2;
    this._options = {
      ...defaultOptions,
      ...options,
    };
    this._paneViews = [new RectanglePaneView(this)];
    this._timeAxisViews = [
      new RectangleTimeAxisView(this, p1),
      new RectangleTimeAxisView(this, p2),
    ];
    this._priceAxisViews = [
      new RectanglePriceAxisView(this, p1),
      new RectanglePriceAxisView(this, p2),
    ];
    this._priceAxisPaneViews = [new RectanglePriceAxisPaneView(this, true)];
    this._timeAxisPaneViews = [new RectangleTimeAxisPaneView(this, false)];
  }

  updateAllViews() {
    this._paneViews.forEach((pw) => pw.update());
    this._timeAxisViews.forEach((pw) => pw.update());
    this._priceAxisViews.forEach((pw) => pw.update());
    this._priceAxisPaneViews.forEach((pw) => pw.update());
    this._timeAxisPaneViews.forEach((pw) => pw.update());
  }

  priceAxisViews() {
    return this._priceAxisViews;
  }

  timeAxisViews() {
    return this._timeAxisViews;
  }

  paneViews() {
    return this._paneViews;
  }

  priceAxisPaneViews() {
    return this._priceAxisPaneViews;
  }

  timeAxisPaneViews() {
    return this._timeAxisPaneViews;
  }

  applyOptions(options: Partial<RectangleDrawingToolOptions>) {
    this._options = { ...this._options, ...options };
    this.requestUpdate();
  }
}

class PreviewRectangle extends Rectangle {
  constructor(
    p1: Point,
    p2: Point,
    data: CandlestickVisualization[],
    options: Partial<RectangleDrawingToolOptions> = {},
  ) {
    super(p1, p2, data, options);
    this._options.fillColorUp = this._options.previewFillColorUp;
  }

  public updateEndPoint(p: Point) {
    this._p2 = p;
    this._paneViews[0].update();
    this._timeAxisViews[1].movePoint(p);
    this._priceAxisViews[1].movePoint(p);
    this.requestUpdate();
  }
}

export class RectangleDrawingTool {
  private _chart: IChartApi | undefined;
  private _series: ISeriesApi<SeriesType> | undefined;
  private _defaultOptions: Partial<RectangleDrawingToolOptions>;
  private _rectangles: Rectangle[];
  private _previewRectangle: PreviewRectangle | undefined = undefined;
  private _points: Point[] = [];
  private _drawing = false;
  private shiftKeyPressed = false;
  private _data: CandlestickVisualization[] = [];

  constructor(
    chart: IChartApi,
    series: ISeriesApi<SeriesType>,
    data: CandlestickVisualization[],
    options: Partial<RectangleDrawingToolOptions>,
  ) {
    this._chart = chart;
    this._series = series;
    this._defaultOptions = options;
    this._rectangles = [];
    this._data = data;

    this._chart.subscribeClick(this._clickHandler);
    this._chart.subscribeCrosshairMove(this._moveHandler);

    document.addEventListener('keydown', this._keydownHandler, true);
    document.addEventListener('keyup', this._keyupHandler, true);
  }

  private _keydownHandler = (event: KeyboardEvent) =>
    (this.shiftKeyPressed = event.shiftKey);
  private _keyupHandler = (event: KeyboardEvent) =>
    (this.shiftKeyPressed = false);

  private _clickHandler = (param: any) => this._onClick(param);
  private _moveHandler = (param: MouseEventParams) => this._onMouseMove(param);

  public updateData(data: CandlestickVisualization[]) {
    this._data = data;
  }

  remove() {
    this.stopDrawing();
    if (this._chart) {
      this._chart.unsubscribeClick(this._clickHandler);
      this._chart.unsubscribeCrosshairMove(this._moveHandler);

      document.removeEventListener('keydown', this._keydownHandler);
      document.removeEventListener('keyup', this._keyupHandler);
    }
    this._rectangles.forEach((rectangle) => {
      this._removeRectangle(rectangle);
    });
    this._rectangles = [];
    this._removePreviewRectangle();
    this._chart = undefined;
    this._series = undefined;
  }

  startDrawing(): void {
    this._drawing = true;
    this._points = [];
    this.clearRectangles();
  }

  clearRectangles() {
    this._rectangles.forEach((rectangle) => {
      this._removeRectangle(rectangle);
    });
    this._rectangles = [];
    this._removePreviewRectangle();
  }

  stopDrawing(): void {
    this._drawing = false;
    this._points = [];
  }

  isDrawing(): boolean {
    return this._drawing;
  }

  private _onClick(param: MouseEventParams) {
    if (this.isDrawing()) {
      this.stopDrawing();
    } else {
      this.clearRectangles();
      if (this.shiftKeyPressed) {
        this.startDrawing();
      }
    }

    if (!this._drawing || !param.point || !param.time || !this._series) return;
    const price = this._series.coordinateToPrice(param.point.y);
    if (price === null) {
      return;
    }
    this._addPoint({
      time: param.time,
      price,
    });
  }

  private _onMouseMove(param: MouseEventParams) {
    if (!this._drawing || !param.point || !param.time || !this._series) return;
    const price = this._series.coordinateToPrice(param.point.y);
    if (price === null) {
      return;
    }
    if (this._previewRectangle) {
      this._previewRectangle.updateEndPoint({
        time: param.time,
        price,
      });
    }
  }

  private _addPoint(p: Point) {
    this._points.push(p);
    if (this._points.length >= 2) {
      this._addNewRectangle(this._points[0], this._points[1]);
      this.stopDrawing();
      this._removePreviewRectangle();
    }
    if (this._points.length === 1) {
      this._addPreviewRectangle(this._points[0]);
    }
  }

  private _addNewRectangle(p1: Point, p2: Point) {
    const rectangle = new Rectangle(p1, p2, this._data, {
      ...this._defaultOptions,
    });
    this._rectangles.push(rectangle);
    ensureDefined(this._series).attachPrimitive(rectangle);
  }

  private _removeRectangle(rectangle: Rectangle) {
    ensureDefined(this._series).detachPrimitive(rectangle);
  }

  private _addPreviewRectangle(p: Point) {
    this._previewRectangle = new PreviewRectangle(p, p, this._data, {
      ...this._defaultOptions,
    });
    ensureDefined(this._series).attachPrimitive(this._previewRectangle);
  }

  private _removePreviewRectangle() {
    if (this._previewRectangle) {
      ensureDefined(this._series).detachPrimitive(this._previewRectangle);
      ensureDefined(this._series).setData(
        ensureDefined(this._series).data() as any[],
      );
      this._previewRectangle = undefined;
    }
  }
}
