export const clearSymbolName = (symbolName: string) =>
  symbolName.replace('_', '').replace('-', '').replace('-SWAP', '');
