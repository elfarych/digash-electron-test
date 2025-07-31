export type BitgtStreamCandle = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export interface BitgetKlineStreamData {
  action: 'update' | 'snapshot';
  arg: { instType: 'SPOT' | 'USDT-FUTURES'; channel: string; instId: string };
  data: [BitgtStreamCandle];
  ts: 1723451848063;
}
