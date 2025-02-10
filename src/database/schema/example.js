const { pgTable, uuid, timestamp } = require('drizzle-orm/pg-core');

const example = pgTable('example', {
  id: uuid('id').primaryKey().defaultRandom(),
  created: timestamp('created', { withTimezone: true }).notNull().defaultNow(),
});

module.exports = { example };
