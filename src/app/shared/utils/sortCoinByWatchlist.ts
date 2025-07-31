import { Exchange } from '../models/Exchange';
import { Watchlist } from '../models/Watchlist';
import { WorkspaceCoins } from '../models/WorkspaceCoins';

export const sortCoinByWatchlist = (
  coins: WorkspaceCoins[],
  market: Exchange,
  watchlist: Watchlist,
) => {
  const watchlistCoins: { color: string; symbol: string }[] =
    watchlist[market]?.map((i) => ({ color: i.color, symbol: i.symbol })) ?? [];
  const colorGroups = {};
  for (const watchlistSymbol of watchlistCoins) {
    const color = watchlistSymbol.color;
    if (!colorGroups[color]) {
      colorGroups[color] = [];
    }

    colorGroups[color].push(watchlistSymbol.symbol);
  }

  const colorOrder = Object.keys(colorGroups);

  return coins.sort((a, b) => {
    const aColorIndex = colorOrder.findIndex((color) =>
      colorGroups[color].includes(a.symbol),
    );
    const bColorIndex = colorOrder.findIndex((color) =>
      colorGroups[color].includes(b.symbol),
    );

    if (aColorIndex !== -1 && bColorIndex !== -1) {
      return aColorIndex - bColorIndex;
    }

    if (aColorIndex !== -1) return -1;
    if (bColorIndex !== -1) return 1;

    return 0;
  });
};
