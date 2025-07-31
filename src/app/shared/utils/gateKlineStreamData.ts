export interface GateSpotCandlesSocketData {
  time: number,
  time_ms: number,
  channel: string,
  event: 'update' | 'subscribe',
  result: {
    t: string,
    v: string,
    c: string,
    h: string,
    l: string,
    o: string,
    n: string,
    a: string,
    w: boolean
  }
}

export interface GateFuturesCandlesSocketData {
  time: number,
  time_ms: number,
  channel: string,
  event: 'update' | 'subscribe',
  result: [{
    t: string,
    v: string,
    c: string,
    h: string,
    l: string,
    o: string,
    n: string,
    a: string,
    w: boolean
  }]
}
