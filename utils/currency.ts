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
  
  // Asia Pacific (Additional)
  BDT: { name: 'Bangladeshi Taka', symbol: '৳', rate: 0.0091, decimals: 2 },
  PKR: { name: 'Pakistani Rupee', symbol: '₨', rate: 0.0036, decimals: 2 },
  NPR: { name: 'Nepalese Rupee', symbol: '₨', rate: 0.0075, decimals: 2 },
  LKR: { name: 'Sri Lankan Rupee', symbol: 'Rs', rate: 0.0031, decimals: 2 },
  MMK: { name: 'Myanmar Kyat', symbol: 'K', rate: 0.00048, decimals: 2 },
  KHR: { name: 'Cambodian Riel', symbol: '៛', rate: 0.00025, decimals: 2 },
  LAK: { name: 'Laotian Kip', symbol: '₭', rate: 0.000052, decimals: 2 },
  CHF: { name: 'Swiss Franc', symbol: 'Fr', rate: 1.13, decimals: 2 },
  SEK: { name: 'Swedish Krona', symbol: 'kr', rate: 0.097, decimals: 2 },
  NOK: { name: 'Norwegian Krone', symbol: 'kr', rate: 0.095, decimals: 2 },
  DKK: { name: 'Danish Krone', symbol: 'kr', rate: 0.15, decimals: 2 },
  PLN: { name: 'Polish Złoty', symbol: 'zł', rate: 0.26, decimals: 2 },
  CZK: { name: 'Czech Koruna', symbol: 'Kč', rate: 0.045, decimals: 2 },
  HUF: { name: 'Hungarian Forint', symbol: 'Ft', rate: 0.0028, decimals: 2 },
  RON: { name: 'Romanian Leu', symbol: 'lei', rate: 0.22, decimals: 2 },
  BGN: { name: 'Bulgarian Lev', symbol: 'лв', rate: 0.56, decimals: 2 },
  ISK: { name: 'Icelandic Króna', symbol: 'kr', rate: 0.0074, decimals: 2 },
  HRK: { name: 'Croatian Kuna', symbol: 'kn', rate: 0.14, decimals: 2 },
  RSD: { name: 'Serbian Dinar', symbol: 'дин.', rate: 0.0094, decimals: 2 },
  UAH: { name: 'Ukrainian Hryvnia', symbol: '₴', rate: 0.027, decimals: 2 },
  
  // American
  CAD: { name: 'Canadian Dollar', symbol: 'C$', rate: 0.75, decimals: 2 },
  MXN: { name: 'Mexican Peso', symbol: 'Mex$', rate: 0.061, decimals: 2 },
  BRL: { name: 'Brazilian Real', symbol: 'R$', rate: 0.21, decimals: 2 },
  ARS: { name: 'Argentine Peso', symbol: '$', rate: 0.0013, decimals: 2 },
  CLP: { name: 'Chilean Peso', symbol: '$', rate: 0.00012, decimals: 0 },
  COP: { name: 'Colombian Peso', symbol: '$', rate: 0.00026, decimals: 2 },
  PEN: { name: 'Peruvian Sol', symbol: 'S/', rate: 0.28, decimals: 2 },
  UYU: { name: 'Uruguayan Peso', symbol: '$U', rate: 0.026, decimals: 2 },
  BOB: { name: 'Bolivian Boliviano', symbol: 'Bs.', rate: 0.145, decimals: 2 },
  PYG: { name: 'Paraguayan Guaraní', symbol: '₲', rate: 0.00014, decimals: 0 },
  VES: { name: 'Venezuelan Bolívar', symbol: 'Bs.', rate: 0.028, decimals: 2 },
  
  // African
  ZAR: { name: 'South African Rand', symbol: 'R', rate: 0.055, decimals: 2 },
  NGN: { name: 'Nigerian Naira', symbol: '₦', rate: 0.00077, decimals: 2 },
  KES: { name: 'Kenyan Shilling', symbol: 'KSh', rate: 0.0079, decimals: 2 },
  GHS: { name: 'Ghanaian Cedi', symbol: '₵', rate: 0.083, decimals: 2 },
  UGX: { name: 'Ugandan Shilling', symbol: 'USh', rate: 0.00027, decimals: 0 },
  TZS: { name: 'Tanzanian Shilling', symbol: 'TSh', rate: 0.00040, decimals: 2 },
  RWF: { name: 'Rwandan Franc', symbol: 'FRw', rate: 0.00087, decimals: 0 },
  ETB: { name: 'Ethiopian Birr', symbol: 'Br', rate: 0.018, decimals: 2 },
  
  // Middle East
  AED: { name: 'UAE Dirham', symbol: 'د.إ', rate: 0.28, decimals: 2 },
  SAR: { name: 'Saudi Riyal', symbol: '﷼', rate: 0.28, decimals: 2 },
  QAR: { name: 'Qatari Riyal', symbol: 'ر.ق', rate: 0.28, decimals: 2 },
  KWD: { name: 'Kuwaiti Dinar', symbol: 'د.ك', rate: 3.30, decimals: 3 },
  BHD: { name: 'Bahraini Dinar', symbol: '.د.ب', rate: 2.70, decimals: 3 },
  OMR: { name: 'Omani Rial', symbol: 'ر.ع.', rate: 2.65, decimals: 3 },
  JOD: { name: 'Jordanian Dinar', symbol: 'د.ا', rate: 1.41, decimals: 3 },
  LBP: { name: 'Lebanese Pound', symbol: 'ل.ل', rate: 0.000067, decimals: 2 },
  IQD: { name: 'Iraqi Dinar', symbol: 'ع.د', rate: 0.00076, decimals: 3 },
  YER: { name: 'Yemeni Rial', symbol: '﷼', rate: 0.0040, decimals: 2 },
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

// Currency formatting 
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

interface ExchangeRateResponse {
  rates: Record<string, number>;
  timestamp: number;
}

interface CryptoRateResponse {
  [key: string]: {
    usd: number;
  };
}

export const updateFiatRates = async (): Promise<void> => {
  try {
    console.log('Fetching fiat rates...');
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ExchangeRateResponse = await response.json();
    console.log('Received fiat rates:', data);
    
    Object.keys(FIAT_CURRENCIES).forEach(currency => {
      if (currency in data.rates) {
        FIAT_CURRENCIES[currency as FiatCurrencyCode].rate = 1 / data.rates[currency];
      }
    });
  } catch (error) {
    console.error('Failed to update fiat currency rates:', error);
  }
};

const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  USDC: 'usd-coin',
  DAI: 'dai',
  BNB: 'binancecoin',
  SOL: 'solana',
  XRP: 'ripple',
  ADA: 'cardano',
  AVAX: 'avalanche-2',
  DOT: 'polkadot',
  MATIC: 'matic-network',
  LINK: 'chainlink',
  ATOM: 'cosmos',
  UNI: 'uniswap',
  DOGE: 'dogecoin',
  SHIB: 'shiba-inu',
  PEPE: 'pepe'
};

export const updateCryptoRates = async (): Promise<void> => {
  try {
    console.log('Fetching crypto rates...');
    const cryptoIds = Object.values(COINGECKO_IDS).join(',');
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: CryptoRateResponse = await response.json();
    console.log('Received crypto rates:', data);
    
    // Update rates using the mapping
    Object.entries(COINGECKO_IDS).forEach(([currency, id]) => {
      if (data[id]) {
        CRYPTO_CURRENCIES[currency as CryptoCurrencyCode].rate = data[id].usd;
      }
    });
  } catch (error) {
    console.error('Failed to update crypto currency rates:', error);
  }
};

export const initializeCurrencyRates = async (): Promise<void> => {
  await Promise.all([
    updateFiatRates(),
    updateCryptoRates()
  ]);
};

export const startRateUpdates = async (intervalMinutes: number = 5): Promise<void> => {
  await initializeCurrencyRates();
  
  setInterval(() => {
    initializeCurrencyRates();
  }, intervalMinutes * 60 * 1000);
};

import type { CurrencyCode } from './types';

export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number {
  if (fromCurrency === toCurrency) return amount;
  return amount;
}
