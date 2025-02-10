const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { Log } = require('../module');
const { Client } = require('pg');
const schema = require('./schema');

const client = new Client(process.env.DATABASE_URL);
const db = drizzle(client, { schema });

const databaseInit = async () => {
  if (process.env.DATABASE_URL) {
    await client.connect();
    await migrate(db, { migrationsFolder: `./src/database/migration` });
    Log.info('Database Connected');
  }
};

module.exports = { db, databaseInit };
