const { ClusterClient } = require('discord-hybrid-sharding');
const { Log } = require('./log');
const { Discord } = require('./discord');

class KoreanBots {
  static async update(cluster) {
    try {
      if (!process.env.KOREANBOTS_TOKEN) return;
      const result = await fetch(
        `https://koreanbots.dev/api/v2/bots/${await Discord.clientId()}/stats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.KOREANBOTS_TOKEN,
          },
          body: JSON.stringify({
            servers: (
              await cluster?.fetchClientValues('guilds.cache.size')
            ).reduce((a, b) => a + b, 0),
            shards:
              cluster instanceof ClusterClient
                ? cluster.info.TOTAL_SHARDS
                : cluster.totalShards,
          }),
        },
      );
      if (!result.ok)
        Log.error(
          `Koreanbots.update error\n${JSON.stringify(await result.json())}`,
        );
    } catch (e) {
      Log.error(e, __filename);
    }
  }
}

module.exports = { KoreanBots };
