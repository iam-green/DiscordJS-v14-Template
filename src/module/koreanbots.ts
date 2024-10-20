import { DiscordUtil, ExtendedClient } from '../discord';
import { ClusterClient, ClusterManager } from 'discord-hybrid-sharding';
import { Log } from './log';

export class KoreanBots {
  static async update(cluster: ClusterManager | ClusterClient<ExtendedClient>) {
    if (!process.env.KOREANBOTS_TOKEN) return;
    const result = await fetch(
      `https://koreanbots.dev/api/v2/bots/${await DiscordUtil.clientId()}/stats`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.KOREANBOTS_TOKEN,
        },
        body: JSON.stringify({
          servers: (
            (await cluster?.fetchClientValues('guilds.cache.size')) as number[]
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
  }
}
