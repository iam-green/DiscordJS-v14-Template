const { glob } = require('glob');
const chalk = require('chalk');
const { Log } = require('../module');

class ExtendedTextCommand {
  static commands = new Map();

  constructor(textCommandOptions) {
    Object.assign(this, textCommandOptions);
  }

  static async init() {
    const commandsPath = glob.sync(
      `${__dirname.replace(/\\/g, '/')}/../textCommand/**/*{.ts,.js}`,
    );
    for (const path of commandsPath)
      if (require(path) instanceof ExtendedTextCommand) {
        const command = require(path);
        const names = Array.isArray(command.name)
          ? command.name
          : [command.name];
        this.commands.set(names, { path, command });
      }
  }

  static async logCommands() {
    for (const [name, { path }] of this.commands)
      Log.debug(
        `Added ${chalk.green(Array.isArray(name) ? name[0] : name)} Text Command (Location : ${chalk.yellow(path)})`,
      );
  }
}

module.exports = { ExtendedTextCommand };
