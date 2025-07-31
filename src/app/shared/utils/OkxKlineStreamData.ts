export interface OkxKlineStreamData {
  event?: string;
  arg: { channel: string; instId: string };
  data: [OkxKlineData];
}


export type OkxKlineData = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];
