export type ExchangeKeysSetupPayload = { api_key: string; api_secret: string };

export interface BinanceAccountPermissions {
  ipRestrict: boolean;
  createTime: number;
  enableReading: boolean;
  enableSpotAndMarginTrading: boolean;
  enableWithdrawals: boolean;
  enableInternalTransfer: boolean;
  enableMargin: boolean;
  enableFutures: boolean;
  permitsUniversalTransfer: boolean;
  enableVanillaOptions: boolean;
  enablePortfolioMarginTrading: boolean;
  enableFixApiTrade: boolean;
  enableFixReadOnly: boolean;
  error?: string;
}

export type ExchangeApiConnectResponse = { success: boolean; error?: string };
