const { Locale } = require('discord.js');
const { glob } = require('glob');
const { BotConfig } = require('../config');

class Language {
  static locale = [];
  static data = new Map();

  static locales(includeDefault = true) {
    if (this.locale.length < 1)
      this.locale = glob
        .sync(`${__filename.replace(/\\/g, '/')}/../language/*.json`)
        .map(
          (v) => v.replace(/\\/g, '/').split('language/')[1].split('.json')[0],
        );
    return includeDefault
      ? this.locale
      : this.locale.filter((v) => v != BotConfig.DEFAULT_LANGUAGE);
  }

  static async init() {
    const localeList = Object.values(Locale).map((v) => v.toString());
    for (const locale of this.locales())
      if (localeList.includes(locale))
        this.data.set(
          locale,
          require(`../language/${locale}.json`),
        );
  }

  static get(locale, data, ...formats) {
    if (this.data.size < 1) return '';
    const result =
      this.data.get(locale)?.[data] ??
      this.data.get(BotConfig.DEFAULT_LANGUAGE)?.[data] ??
      '';
    if (!/{(\d+)}/g.test(result)) return result;
    return result.replace(/{(\d+)}/g, (match, number) => {
      return typeof formats[number] != 'undefined' ? formats[number] : match;
    });
  }

  static command(name) {
    return {
      name: Language.get(BotConfig.DEFAULT_LANGUAGE, `Command_${name}_Name`),
      description: Language.get(
        BotConfig.DEFAULT_LANGUAGE,
        `Command_${name}_Description`,
      ),
      localization: {
        name: Language.locales()
          .map((v) => ({
            [v]: Language.get(v, `Command_${name}_Name`),
          }))
          .reduce((a, b) => ({ ...a, ...b })),
        description: Language.locales()
          .map((v) => ({
            [v]: Language.get(v, `Command_${name}_Description`),
          }))
          .reduce((a, b) => ({ ...a, ...b })),
      },
    };
  }

  static commandOption(command_name, command_option, option) {
    return option
      .setName(
        Language.get(
          BotConfig.DEFAULT_LANGUAGE,
          `Command_${command_name}_Option_${command_option}_Name`,
        ),
      )
      .setDescription(
        Language.get(
          BotConfig.DEFAULT_LANGUAGE,
          `Command_${command_name}_Option_${command_option}_Description`,
        ),
      )
      .setNameLocalizations(
        Language.locales()
          .map((v) => ({
            [v]: Language.get(
              v,
              `Command_${command_name}_Option_${command_option}_Name`,
            ),
          }))
          .reduce((a, b) => ({ ...a, ...b })),
      )
      .setDescriptionLocalizations(
        Language.locales()
          .map((v) => ({
            [v]: Language.get(
              v,
              `Command_${command_name}_Option_${command_option}_Description`,
            ),
          }))
          .reduce((a, b) => ({ ...a, ...b })),
      );
  }

  static commandOptionChoice(
    command_name,
    command_option,
    command_choice,
    option,
  ) {
    return this.commandOption(command_name, command_option, option).addChoices(
      command_choice.map((v) => ({
        name: Language.get(
          BotConfig.DEFAULT_LANGUAGE,
          `Command_${command_name}_Option_${command_option}_Choice_${v}`,
        ),
        value: v,
        name_localizations: Language.locales()
          .map((w) => ({
            [w]: Language.get(
              w,
              `Command_${command_name}_Option_${command_option}_Choice_${v}`,
            ),
          }))
          .reduce((a, b) => ({ ...a, ...b })),
      })),
    );
  }
}

module.exports = { Language };
