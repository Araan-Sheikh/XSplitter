// Define currency info interfaces
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
  EUR: { name: 'Euro', symbol: '€', rate: 0.94, decimals: 2 },
  GBP: { name: 'British Pound', symbol: '£', rate: 0.82, decimals: 2 },
  JPY: { name: 'Japanese Yen', symbol: '¥', rate: 0.0070, decimals: 0 },
  
  // Asia Pacific
  CNY: { name: 'Chinese Yuan', symbol: '¥', rate: 0.145, decimals: 2 },
  INR: { name: 'Indian Rupee', symbol: '₹', rate: 0.013, decimals: 2 },
  KRW: { name: 'South Korean Won', symbol: '₩', rate: 0.00077, decimals: 0 },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', rate: 0.76, decimals: 2 },
  AUD: { name: 'Australian Dollar', symbol: 'A$', rate: 0.68, decimals: 2 },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', rate: 0.63, decimals: 2 },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', rate: 0.13, decimals: 2 },
  TWD: { name: 'Taiwan Dollar', symbol: 'NT$', rate: 0.034, decimals: 2 },
  MYR: { name: 'Malaysian Ringgit', symbol: 'RM', rate: 0.22, decimals: 2 },
  THB: { name: 'Thai Baht', symbol: '฿', rate: 0.029, decimals: 2 },
  PHP: { name: 'Philippine Peso', symbol: '₱', rate: 0.019, decimals: 2 },
  IDR: { name: 'Indonesian Rupiah', symbol: 'Rp', rate: 0.000065, decimals: 2 },
  VND: { name: 'Vietnamese Dong', symbol: '₫', rate: 0.000042, decimals: 0 },
  
  // Europe
  CHF: { name: 'Swiss Franc', symbol: 'Fr', rate: 1.13, decimals: 2 },
  SEK: { name: 'Swedish Krona', symbol: 'kr', rate: 0.097, decimals: 2 },
  NOK: { name: 'Norwegian Krone', symbol: 'kr', rate: 0.095, decimals: 2 },
  DKK: { name: 'Danish Krone', symbol: 'kr', rate: 0.15, decimals: 2 },
  PLN: { name: 'Polish Złoty', symbol: 'zł', rate: 0.26, decimals: 2 },
  CZK: { name: 'Czech Koruna', symbol: 'Kč', rate: 0.045, decimals: 2 },
  HUF: { name: 'Hungarian Forint', symbol: 'Ft', rate: 0.0028, decimals: 2 },
  RON: { name: 'Romanian Leu', symbol: 'lei', rate: 0.22, decimals: 2 },
  BGN: { name: 'Bulgarian Lev', symbol: 'лв', rate: 0.56, decimals: 2 },
  
  // Americas
  CAD: { name: 'Canadian Dollar', symbol: 'C$', rate: 0.75, decimals: 2 },
  MXN: { name: 'Mexican Peso', symbol: 'Mex$', rate: 0.061, decimals: 2 },
  BRL: { name: 'Brazilian Real', symbol: 'R$', rate: 0.21, decimals: 2 },
  ARS: { name: 'Argentine Peso', symbol: '$', rate: 0.0013, decimals: 2 },
  CLP: { name: 'Chilean Peso', symbol: '$', rate: 0.00012, decimals: 0 },
  COP: { name: 'Colombian Peso', symbol: '$', rate: 0.00026, decimals: 2 },
  PEN: { name: 'Peruvian Sol', symbol: 'S/', rate: 0.28, decimals: 2 },
  
  // Middle East & Africa
  AED: { name: 'UAE Dirham', symbol: 'د.إ', rate: 0.28, decimals: 2 },
  SAR: { name: 'Saudi Riyal', symbol: '﷼', rate: 0.28, decimals: 2 },
  QAR: { name: 'Qatari Riyal', symbol: 'ر.ق', rate: 0.28, decimals: 2 },
  KWD: { name: 'Kuwaiti Dinar', symbol: 'د.ك', rate: 3.30, decimals: 3 },
  BHD: { name: 'Bahraini Dinar', symbol: '.د.ب', rate: 2.70, decimals: 3 },
  OMR: { name: 'Omani Rial', symbol: 'ر.ع.', rate: 2.65, decimals: 3 },
  EGP: { name: 'Egyptian Pound', symbol: 'E£', rate: 0.034, decimals: 2 },
  ZAR: { name: 'South African Rand', symbol: 'R', rate: 0.055, decimals: 2 },
  NGN: { name: 'Nigerian Naira', symbol: '₦', rate: 0.00077, decimals: 2 },
  KES: { name: 'Kenyan Shilling', symbol: 'KSh', rate: 0.0079, decimals: 2 },
  TRY: { name: 'Turkish Lira', symbol: '₺', rate: 0.033, decimals: 2 },
  ILS: { name: 'Israeli Shekel', symbol: '₪', rate: 0.29, decimals: 2 },
} as const;

export const CRYPTO_CURRENCIES: Record<string, CurrencyInfo> = {
  // Major Cryptocurrencies
  BTC: { name: 'Bitcoin', symbol: '₿', rate: 98000, decimals: 8 },
  ETH: { name: 'Ethereum', symbol: 'Ξ', rate: 3400, decimals: 18 },
  
  // Stablecoins
  USDT: { name: 'Tether', symbol: '₮', rate: 1, decimals: 6 },
  USDC: { name: 'USD Coin', symbol: '$', rate: 1, decimals: 6 },
  DAI: { name: 'Dai', symbol: 'DAI', rate: 1, decimals: 18 },
  
  // Major Altcoins
  BNB: { name: 'Binance Coin', symbol: 'BNB', rate: 610, decimals: 18 },
  SOL: { name: 'Solana', symbol: 'SOL', rate: 190, decimals: 9 },
  XRP: { name: 'Ripple', symbol: 'XRP', rate: 0.65, decimals: 6 },
  ADA: { name: 'Cardano', symbol: '₳', rate: 0.75, decimals: 6 },
  AVAX: { name: 'Avalanche', symbol: 'AVAX', rate: 50, decimals: 18 },
  DOT: { name: 'Polkadot', symbol: 'DOT', rate: 10, decimals: 10 },
  MATIC: { name: 'Polygon', symbol: 'MATIC', rate: 1.5, decimals: 18 },
  LINK: { name: 'Chainlink', symbol: 'LINK', rate: 22, decimals: 18 },
  ATOM: { name: 'Cosmos', symbol: 'ATOM', rate: 12, decimals: 6 },
  UNI: { name: 'Uniswap', symbol: 'UNI', rate: 9, decimals: 18 },
  
  // Meme Coins
  DOGE: { name: 'Dogecoin', symbol: 'Ð', rate: 0.20, decimals: 8 },
  SHIB: { name: 'Shiba Inu', symbol: 'SHIB', rate: 0.000030, decimals: 18 },
  PEPE: { name: 'Pepe', symbol: 'PEPE', rate: 0.0000015, decimals: 18 },
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
  
