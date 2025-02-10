require('dotenv/config');
const { BotConfig } = require('../config');
const { getInfo } = require('discord-hybrid-sharding');
const { ExtendedClient } = require('../structure');
const { databaseInit } = require('../database');

const client = new ExtendedClient({
  ...BotConfig.CLIENT_OPTION,
  shards: getInfo().SHARD_LIST,
  shardCount: getInfo().TOTAL_SHARDS,
});

(async () => {
  await databaseInit();
  await client.start();
})();
