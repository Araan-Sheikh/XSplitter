// Define currency info interfaces using API we can fetch live rates this method which we had done is manual
interface CurrencyInfo {
  name: string;
  symbol: string;
  rate: number;
  decimals: number;
}

// Constants for currencies using usd as default currency, here more currencies can be defined
export const FIAT_CURRENCIES: Record<string, CurrencyInfo> = {
  // Major Currencies
  USD: { name: 'US Dollar', symbol: '$', rate: 1, decimals: 2 },
  EUR: { name: 'Euro', symbol: '€', rate: 0.92, decimals: 2 },
  GBP: { name: 'British Pound', symbol: '£', rate: 0.79, decimals: 2 },
  JPY: { name: 'Japanese Yen', symbol: '¥', rate: 0.0067, decimals: 0 },
  
  // Asia Pacific
  CNY: { name: 'Chinese Yuan', symbol: '¥', rate: 0.14, decimals: 2 },
  INR: { name: 'Indian Rupee', symbol: '₹', rate: 0.012, decimals: 2 },
  KRW: { name: 'South Korean Won', symbol: '₩', rate: 0.00075, decimals: 0 },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', rate: 0.74, decimals: 2 },
  AUD: { name: 'Australian Dollar', symbol: 'A$', rate: 0.65, decimals: 2 },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', rate: 0.61, decimals: 2 },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', rate: 0.13, decimals: 2 },
  TWD: { name: 'Taiwan Dollar', symbol: 'NT$', rate: 0.032, decimals: 2 },
  
  // Europe
  CHF: { name: 'Swiss Franc', symbol: 'Fr', rate: 1.12, decimals: 2 },
  SEK: { name: 'Swedish Krona', symbol: 'kr', rate: 0.096, decimals: 2 },
  NOK: { name: 'Norwegian Krone', symbol: 'kr', rate: 0.094, decimals: 2 },
  DKK: { name: 'Danish Krone', symbol: 'kr', rate: 0.14, decimals: 2 },
  PLN: { name: 'Polish Złoty', symbol: 'zł', rate: 0.25, decimals: 2 },
  
  // Americas
  CAD: { name: 'Canadian Dollar', symbol: 'C$', rate: 0.74, decimals: 2 },
  MXN: { name: 'Mexican Peso', symbol: 'Mex$', rate: 0.059, decimals: 2 },
  BRL: { name: 'Brazilian Real', symbol: 'R$', rate: 0.20, decimals: 2 },
  ARS: { name: 'Argentine Peso', symbol: '$', rate: 0.0012, decimals: 2 },
  
  // Middle East & Africa
  AED: { name: 'UAE Dirham', symbol: 'د.إ', rate: 0.27, decimals: 2 },
  SAR: { name: 'Saudi Riyal', symbol: '﷼', rate: 0.27, decimals: 2 },
  ZAR: { name: 'South African Rand', symbol: 'R', rate: 0.053, decimals: 2 },
  TRY: { name: 'Turkish Lira', symbol: '₺', rate: 0.031, decimals: 2 },
  ILS: { name: 'Israeli Shekel', symbol: '₪', rate: 0.27, decimals: 2 },
} as const;

export const CRYPTO_CURRENCIES: Record<string, CurrencyInfo> = {
  // Major Cryptocurrencies
  BTC: { name: 'Bitcoin', symbol: '₿', rate: 67000, decimals: 8 },
  ETH: { name: 'Ethereum', symbol: 'Ξ', rate: 3300, decimals: 18 },
  
  // Stablecoins
  USDT: { name: 'Tether', symbol: '₮', rate: 1, decimals: 6 },
  USDC: { name: 'USD Coin', symbol: '$', rate: 1, decimals: 6 },
  DAI: { name: 'Dai', symbol: 'DAI', rate: 1, decimals: 18 },
  
  // Major Altcoins
  BNB: { name: 'Binance Coin', symbol: 'BNB', rate: 570, decimals: 18 },
  SOL: { name: 'Solana', symbol: 'SOL', rate: 180, decimals: 9 },
  XRP: { name: 'Ripple', symbol: 'XRP', rate: 0.62, decimals: 6 },
  ADA: { name: 'Cardano', symbol: '₳', rate: 0.70, decimals: 6 },
  AVAX: { name: 'Avalanche', symbol: 'AVAX', rate: 55, decimals: 18 },
  DOT: { name: 'Polkadot', symbol: 'DOT', rate: 9, decimals: 10 },
  MATIC: { name: 'Polygon', symbol: 'MATIC', rate: 1.2, decimals: 18 },
  
  // Meme Coins
  DOGE: { name: 'Dogecoin', symbol: 'Ð', rate: 0.18, decimals: 8 },
  SHIB: { name: 'Shiba Inu', symbol: 'SHIB', rate: 0.000029, decimals: 18 },
} as const;

// Type definitions
export type FiatCurrencyCode = keyof typeof FIAT_CURRENCIES;
export type CryptoCurrencyCode = keyof typeof CRYPTO_CURRENCIES;
export type CurrencyCode = FiatCurrencyCode | CryptoCurrencyCode;

// Type guards
export const isCryptoCurrency = (currency: string): currency is CryptoCurrencyCode => {
  return currency in CRYPTO_CURRENCIES;
};

export const isFiatCurrency = (currency: string): currency is FiatCurrencyCode => {
  return currency in FIAT_CURRENCIES;
};

// Currency formatting function with proper decimal handling
export const formatCurrency = (amount: number, currency: CurrencyCode): string => {
  if (isCryptoCurrency(currency)) {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: CRYPTO_CURRENCIES[currency].decimals,
    });
    return `${CRYPTO_CURRENCIES[currency].symbol}${formatter.format(Math.abs(amount))}`;
  }

  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: FIAT_CURRENCIES[currency as FiatCurrencyCode].decimals,
      maximumFractionDigits: FIAT_CURRENCIES[currency as FiatCurrencyCode].decimals,
    });
    return formatter.format(Math.abs(amount));
  } catch (error) {
    const info = FIAT_CURRENCIES[currency as FiatCurrencyCode];
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: info.decimals,
      maximumFractionDigits: info.decimals,
    });
    return `${info.symbol}${formatter.format(Math.abs(amount))}`;
  }
};

export const convertAmount = (
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number => {
  if (fromCurrency === toCurrency) return amount;

  const fromInfo = isCryptoCurrency(fromCurrency) 
    ? CRYPTO_CURRENCIES[fromCurrency] 
    : FIAT_CURRENCIES[fromCurrency];
  
  const toInfo = isCryptoCurrency(toCurrency) 
    ? CRYPTO_CURRENCIES[toCurrency] 
    : FIAT_CURRENCIES[toCurrency];

  if (!fromInfo || !toInfo) {
    throw new Error(`Invalid currency conversion: ${fromCurrency} to ${toCurrency}`);
  }

  const amountInUSD = amount * fromInfo.rate;
  return amountInUSD / toInfo.rate;
};

export const validateCurrency = (currency: string): CurrencyCode => {
  if (isCryptoCurrency(currency) || isFiatCurrency(currency)) {
    return currency as CurrencyCode;
  }
  throw new Error(`Invalid currency: ${currency}`);
};

// Helper functions for currency info
export const getCurrencyName = (currency: CurrencyCode): string => {
  if (isCryptoCurrency(currency)) {
    return CRYPTO_CURRENCIES[currency].name;
  }
  return FIAT_CURRENCIES[currency].name;
};

export const getCurrencySymbol = (currency: CurrencyCode): string => {
  if (isCryptoCurrency(currency)) {
    return CRYPTO_CURRENCIES[currency].symbol;
  }
  return FIAT_CURRENCIES[currency].symbol;
};

export const getCurrencyRate = (currency: CurrencyCode): number => {
  if (isCryptoCurrency(currency)) {
    return CRYPTO_CURRENCIES[currency].rate;
  }
  return FIAT_CURRENCIES[currency].rate;
};
  
