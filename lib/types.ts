export type Token = {
    contractAddress: string;
    name: string;
    symbol: string;
    logo: string | null;
    balance: string;
    decimals: number;
    priceUsd: number;
    valueUsd: number;
    change24h: number;
  };