const chalk = require('chalk');
const fs = require('fs');

class Log {
  static write(type, content) {
    const date = this.date(true);
    const path = `${__filename}/../../log`;
    for (const name of [`${type}_${date}.log`, `all_${date}.log`]) {
      if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
      fs.appendFileSync(
        `${path}/${name}`,
        content.replace(/\x1b\[[0-9;]*m/g, '') + '\n',
      );
    }
  }

  static date(only_date) {
    const date = new Date();
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    return only_date
      ? `${year}-${month}-${day}`
      : `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  static prefix(type, color) {
    return `${chalk.cyan('[')}${color(type)}${chalk.cyan(']')} ${chalk.cyan('(')}${chalk.yellow(this.date())}${chalk.cyan(')')}`;
  }

  static info(content) {
    const result = `${this.prefix('INFO', chalk.green)} ${content.replace(/\n/g, '\n\t')}`;
    console.log(result);
    if (process.env.SAVE_LOGS == 'true') this.write('info', result);
  }

  static debug(content) {
    const result = `${this.prefix('DEBUG', chalk.magenta)} ${content.replace(/\n/g, '\n\t')}`;
    if (process.env.NODE_ENV == 'development') console.log(result);
    if (process.env.SAVE_LOGS == 'true') this.write('debug', result);
  }

  static warn(content) {
    const result = `${this.prefix('WARN', chalk.yellow)} ${content.replace(/\n/g, '\n\t')}`;
    console.log(result);
    if (process.env.SAVE_LOGS == 'true') this.write('warn', result);
  }

  static error(error, file) {
    const result = `${this.prefix('ERROR', chalk.red)} ${chalk
      .red(
        error instanceof Error
          ? [
              `${error.name} - ${error.message}`,
              file ? `File : ${file}` : '',
              `Stack : ${error.stack}`,
            ]
              .filter((v) => v)
              .join('\n')
          : error,
      )
      .replace(/\n/g, '\n\t')}`;
    console.log(result);
    if (process.env.SAVE_LOGS == 'true') this.write('error', result);
  }
}

module.exports = { Log };
