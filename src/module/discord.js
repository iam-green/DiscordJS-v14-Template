const { PermissionsBitField, REST, Routes } = require('discord.js');

 class Discord {
  static expire = 0;
  static client_id = '';
  static other_client_id = [];
  static admin_id = [];
  static developer_id = [];

  static async getValues() {
    if (!process.env.BOT_TOKEN) throw new Error('No Bot Token');
    const rest = new REST().setToken(process.env.BOT_TOKEN);
    const result = await rest.get(Routes.currentApplication());
    this.client_id = result.id;
    this.admin_id = result.team
      ? result.team.members
          .filter((v) => v.role == 'admin')
          .map((v) => v.user.id)
      : [result.owner.id];
    this.developer_id = result.team
      ? result.team.members
          .filter((v) => v.role == 'developer')
          .map((v) => v.user.id)
      : [];
    this.other_client_id =
      result.team && process.env.DISCORD_USER_TOKEN
        ? (
            await (
              await fetch(
                `https://discord.com/api/v10/teams/${result.team.id}/applications`,
                { headers: { Authorization: process.env.DISCORD_USER_TOKEN } },
              )
            ).json()
          )
            .map((v) => v.id)
            .filter((v) => v != result.id)
        : [];
    this.expire = Date.now() + 1000 * 60 * 60 * 4;
  }

  static async clientId(refresh = false) {
    if (this.expire < Date.now() || refresh) await this.getValues();
    return this.client_id;
  }

  static async otherClientId(refresh = false) {
    if (this.expire < Date.now() || refresh) await this.getValues();
    return this.other_client_id;
  }

  static async adminId(refresh = false) {
    if (this.expire < Date.now() || refresh) await this.getValues();
    return this.admin_id;
  }

  static async developerId(refresh = false) {
    if (this.expire < Date.now() || refresh) await this.getValues();
    return this.developer_id;
  }

  static convertPermissionToString(value) {
    if (typeof value != 'bigint' && !/^-?\d+$/.test(value.toString()))
      return value;
    return Object.values(PermissionsBitField.Flags).find((v) => v == value)[0];
  }

  static checkPermission(memberPermission, permission) {
    if (!memberPermission) return { status: false };
    const require_permission = [];
    for (const p of Array.isArray(permission) ? permission : [permission])
      if (!memberPermission.has(p)) require_permission.push(p);
    return { status: require_permission.length == 0, require_permission };
  }
}

module.exports = { Discord };