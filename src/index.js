require('dotenv/config');
const { discordInit } = require('./loader');

async function bootstrap() {
  await discordInit();
}
bootstrap();
