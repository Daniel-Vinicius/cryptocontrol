import { tableSchema } from '@nozbe/watermelondb';

const transactionSchema = tableSchema({
  name: 'transactions',
  columns: [
    { name: 'user_id', type: 'string', isIndexed: true },
    { name: 'name', type: 'string' },
    { name: 'type', type: 'string' },
    { name: 'date', type: 'number' },
    { name: 'date_formatted', type: 'string' },
    { name: 'amount', type: 'number' },
    { name: 'amount_formatted', type: 'string' },
    { name: 'coin', type: 'string' },
  ],
});

export { transactionSchema };
