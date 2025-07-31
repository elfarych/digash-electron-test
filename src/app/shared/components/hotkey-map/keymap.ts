export interface KeymapItem {
  buttons: string[];
  name: string;
}

export interface KeymapSection {
  name: string;
  items: KeymapItem[];
}

export const keymapSections: KeymapSection[] = [
  {
    name: 'common.title',
    items: [
      { name: 'common.closeDialog', buttons: ['Escape'] },
      { name: 'common.navigateToScreener', buttons: ['Shift', '1'] },
      { name: 'common.navigateToCoins', buttons: ['Shift', '2'] },
      { name: 'common.navigateToDepthMap', buttons: ['Shift', '3'] },
      { name: 'common.navigateToAlerts', buttons: ['Shift', '4'] },
    ],
  },

  {
    name: 'screener.title',
    items: [
      { name: 'screener.updateData', buttons: ['Shift', 'R'] },
      { name: 'screener.openSettings', buttons: ['Shift', 'S'] },
      { name: 'screener.nextWorkspace', buttons: ['ArrowRight (>)'] },
      { name: 'screener.prevWorkspace', buttons: ['ArrowLeft (<)'] },
      { name: 'screener.createWorkspace', buttons: ['Shift', '+'] },
    ],
  },

  {
    name: 'coins.title',
    items: [
      { name: 'coins.navigationNext', buttons: ['Space'] },
      { name: 'coins.navigationNext', buttons: ['ArrowDown'] },
      { name: 'coins.navigationPrev', buttons: ['ArrowUp'] },
      { name: 'coins.timeframeChange', buttons: ['123456'] },
      { name: 'coins.updateData', buttons: ['Shift', 'R'] },
      { name: 'coins.openSettings', buttons: ['Shift', 'S'] },
      { name: 'coins.swapExchange', buttons: ['Shift', 'E'] },
      { name: 'coins.screenshot', buttons: ['Shift', 'P'] },
      { name: 'coins.copyTicker', buttons: ['Alt', 'Click'] },
    ],
  },

  {
    name: 'chart.title',
    items: [
      { name: 'chart.loadTrades', buttons: ['Shift', 'T'] },
      { name: 'chart.horizontalRay', buttons: ['RightClick'] },
      { name: 'chart.measure', buttons: ['Shift', 'Click'] },
      { name: 'chart.measure', buttons: ['WheelDown'] },
      { name: 'chart.brush', buttons: ['Alt', 'b'] },
      { name: 'chart.trendLine', buttons: ['Alt', 't'] },
      // { name: 'chart.trendRay', buttons: ['Alt', 'g'] },
      { name: 'chart.rectangle', buttons: ['Alt', 'r'] },
      { name: 'chart.fibo', buttons: ['Alt', 'f'] },
    ],
  },

  {
    name: 'depthMap.title',
    items: [
      { name: 'depthMap.resize', buttons: ['Shift', '+'] },
      { name: 'depthMap.updateData', buttons: ['Shift', 'R'] },
      { name: 'depthMap.openSettings', buttons: ['Shift', 'S'] },
    ],
  },
];
