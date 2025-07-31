export interface BybitOpenInterest {
  result: {
    symbol: string;
    list: {
      openInterest: string;
      timestamp: string;
    }[]
  }
}
