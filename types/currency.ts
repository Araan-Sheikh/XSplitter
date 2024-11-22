export interface FiatCurrency {
  name: string;
  rate: number;
}

export interface CryptoCurrency {
  name: string;
  rate: number;
  symbol: string;
}

export interface ExchangeRates {
  fiat: Record<string, number>;
  crypto: Record<string, { usd: number }>;
} 