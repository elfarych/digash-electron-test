export interface CoinDataQuestionEventDetails {
  x: number;
  y: number;
  arcRadius: number;
  type: string
}

export type CoinDataQuestionEvent = CustomEvent<CoinDataQuestionEventDetails>;
