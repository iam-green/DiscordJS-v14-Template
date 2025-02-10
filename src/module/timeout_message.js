class TimeoutMessage {
  static list = new Map();

  static async set(message, timeout) {
    this.list.set(
      message,
      setTimeout(async () => {
        if (!message || !message.deletable) return;
        message?.delete().catch(() => {});
        this.list.delete(message);
      }, timeout),
    );
  }

  static async clear(message) {
    clearTimeout(this.list.get(message));
    this.list.delete(message);
  }
}

module.exports = { TimeoutMessage };