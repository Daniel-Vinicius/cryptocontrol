import { Model, associations, Query } from '@nozbe/watermelondb';
import { field, text, children } from '@nozbe/watermelondb/decorators';
import { Transaction } from './Transaction';

class User extends Model {
  static table = 'users';

  static associations = associations([
    'transactions',
    { type: 'has_many', foreignKey: 'user_id' },
  ]);

  @children('transactions')
  transactions!: Query<Transaction>;

  @field('user_id')
  user_id!: string;

  @text('name')
  name!: string;

  @field('email')
  email!: string;

  @field('photo')
  photo!: string;
}

export { User };
