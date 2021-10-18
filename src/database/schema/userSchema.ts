import { tableSchema } from '@nozbe/watermelondb';

const userSchema = tableSchema({
  name: 'users',
  columns: [
    { name: 'user_id', type: 'string', isIndexed: true },
    { name: 'name', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'photo', type: 'string' },
  ],
});

export { userSchema };
