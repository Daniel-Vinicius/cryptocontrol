export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
}

export interface CoinInTransaction extends Omit<Coin, 'current_price'> {
  quantity: number;
  price: number;
}

export type CoinDetails = Omit<Coin, 'current_price'>;

export type TransactionType = 'positive' | 'negative';

export interface Transaction {
  id: string;
  name: string;
  type: TransactionType;
  date: Date;
  dateFormatted: string;
  amount: number;
  amountFormatted: string;
  coin: CoinInTransaction;
  user_id: string;
}
