import { OrderbookLines } from './OrderbookLines';
import {
  AutoscaleInfo,
  ISeriesPrimitivePaneRenderer,
  ISeriesPrimitivePaneView,
  Time,
} from 'lightweight-charts';
import { OrderbookPaneRenderer, RendererDataItem } from './OrderbookRenderer';
import { cancelIcon, downArrowIcon, tickIcon, upArrowIcon } from './icons';
import { PluginBase } from '../PluginBase';

class OrderbookPaneView implements ISeriesPrimitivePaneView {
  _source: OrderbookLines;
  _renderer: OrderbookPaneRenderer;

  constructor(source: OrderbookLines) {
    this._source = source;
    this._renderer = new OrderbookPaneRenderer();
  }

  renderer(): ISeriesPrimitivePaneRenderer {
    return this._renderer;
  }

  update() {
    const data: RendererDataItem[] = [];
    const ts = this._source._chart?.timeScale();
    if (ts) {
      for (const alert of this._source._alerts.values()) {
        const priceY = this._source._series.priceToCoordinate(alert.price);
        if (priceY === null) continue;
        let startX: number | null = ts.timeToCoordinate(alert.start as Time) as
          | number
          | null;
        let endX: number | null = ts.timeToCoordinate(alert.end as Time) as
          | number
          | null;
        if (startX === null && endX === null) continue;
        if (!startX) startX = 0;
        if (!endX) endX = ts.width();
        let color = '#000000';
        let icon = upArrowIcon;
        if (alert.parameters.crossingDirection === 'up') {
          color = alert.parameters.color;
          icon = alert.crossed
            ? tickIcon
            : alert.expired
              ? cancelIcon
              : upArrowIcon;
        } else if (alert.parameters.crossingDirection === 'down') {
          color = alert.parameters.color;
          icon = alert.crossed
            ? tickIcon
            : alert.expired
              ? cancelIcon
              : downArrowIcon;
        }
        data.push({
          priceY,
          startX,
          endX,
          icon,
          color,
          text: alert.parameters.title,
          fade: alert.expired,
        });
      }
    }

    this._renderer.update(data);
  }
}

export class OrderbookPrimitive extends PluginBase {
  _source: OrderbookLines;
  _views: OrderbookPaneView[];

  constructor(source: OrderbookLines) {
    super();
    this._source = source;
    this._views = [new OrderbookPaneView(this._source)];
  }

  override requestUpdate() {
    super.requestUpdate();
  }

  updateAllViews() {
    this._views.forEach((view) => view.update());
  }

  paneViews(): readonly ISeriesPrimitivePaneView[] {
    return this._views;
  }

  // autoscaleInfo(): AutoscaleInfo | null {
  //   let smallest = Infinity;
  //   let largest = -Infinity;
  //   for (const alert of this._source._alerts.values()) {
  //     if (alert.price < smallest) smallest = alert.price;
  //     if (alert.price > largest) largest = alert.price;
  //   }
  //   if (smallest > largest) return null;
  //   return {
  //     priceRange: {
  //       maxValue: largest,
  //       minValue: smallest,
  //     },
  //   };
  // }
}
