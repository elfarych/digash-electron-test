export interface BybitKlineStreamData {
  topic: string;
  ts: number;
  data: {
    start: number;
    end: number;
    interval: number;
    open: string;
    close: string;
    high: string;
    low: string;
    volume: string;
    turnover: string;
    confirm: boolean;
    timestamp: number;
  }[];
  type: 'snapshot';
}
