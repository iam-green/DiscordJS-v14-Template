const { glob } = require('glob');
const { Log } = require('../module');
const chalk = require('chalk');
const path = require('path');

class ExtendedEvent {
  static list = new Map();

  constructor(eventOptions) {
    Object.assign(this, eventOptions);
  }

  static async init() {
    if (this.list.size < 1) {
      const events = glob.sync(
        `${__dirname.replace(/\\/g, '/')}/../event/**/*{.ts,.js}`,
      );
      for (const path of events)
        if (require(path) instanceof ExtendedEvent)
          this.list.set(path, { path, event: require(path) });
    }
    return this.list;
  }

  static async logEvents() {
    for (const { path, event } of this.list.values())
      Log.debug(
        `Added ${chalk.green(event.event)} Event (Location : ${chalk.yellow(path)})`,
      );
  }
}

module.exports = { ExtendedEvent };
