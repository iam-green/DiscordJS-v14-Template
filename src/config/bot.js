const { GatewayIntentBits, Options } = require('discord.js');

const BotConfig = {
  NAME: 'Template',
  COMMAND_PREFIX: ['/', '?', '!', '?!'],
  DEFAULT_LANGUAGE: 'en-US',
  CLIENT_OPTION: {
    intents: [
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
    ],
    sweepers: {
      ...Options.DefaultSweeperSettings,
      messages: { interval: 3600, lifetime: 1800 },
      users: {
        interval: 3600,
        filter: () => (user) => user.bot && user.id != user.client.user.id,
      },
    },
  },
};

module.exports = { BotConfig };
