import { appSchema } from '@nozbe/watermelondb';

import { transactionSchema } from './transactionSchema';
import { userSchema } from './userSchema';

const schemas = appSchema({
  version: 1,
  tables: [transactionSchema, userSchema],
});

export { schemas };
