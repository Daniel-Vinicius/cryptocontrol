import { Model, associations } from '@nozbe/watermelondb';
import {
  field,
  date,
  text,
  json,
  immutableRelation,
} from '@nozbe/watermelondb/decorators';

import { CoinInTransaction } from '../../services/types';

import { User } from './User';

const sanitizeCoin = (rawCoin: Record<string, unknown>): CoinInTransaction => {
  return {
    id: rawCoin.id as string,
    name: rawCoin.name as string,
    symbol: rawCoin.symbol as string,
    image: rawCoin.image as string,
    price: rawCoin.price as number,
    quantity: rawCoin.quantity as number,
  };
};

class Transaction extends Model {
  static table = 'transactions';

  static associations = associations([
    'users',
    { type: 'belongs_to', key: 'user_id' },
  ]);

  @immutableRelation('users', 'user_id')
  user!: User;

  @field('user_id')
  user_id!: string;

  @text('name')
  name!: string;

  @field('type')
  type!: string;

  @date('date')
  date!: Date;

  @field('date_formatted')
  dateFormatted!: string;

  @field('amount')
  amount!: number;

  @field('amount_formatted')
  amountFormatted!: string;

  @json('coin', sanitizeCoin)
  coin!: CoinInTransaction;
}

export { Transaction };
