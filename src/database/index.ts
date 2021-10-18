import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schemas } from './schema';
import { migrations } from './migrations';

import { Transaction } from './model/Transaction';
import { User } from './model/User';

const adapter = new SQLiteAdapter({
  schema: schemas,
  migrations,
  dbName: 'cryptocontrol',
});

export const database = new Database({
  adapter,
  modelClasses: [Transaction, User],
});
