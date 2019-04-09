const EventEmitter = require('events');
const exec = require('child_process').execSync;
const chalk = require('chalk');
const defaultRules = require('./default-rules');
const defaultEvents = require('./default-events');

const { log } = console;

class GitChecker extends EventEmitter {
  constructor(type, options) {
    super();
    const { rules = {}, defaultEventNames = [], checkEvents = {} } = options;
    this.rules = Object.assign(defaultRules, rules);
    this.checkEvents = Object.assign(this.getDefaultEvents(defaultEventNames), checkEvents);
    this.type = type;
    this.isCommit = true;
    this.gitConfigEnvs = ['local', 'global', 'system'];
    this.forbiddenCommit = this.forbiddenCommit.bind(this);
    this.init();
  }

  init() {
    this.log = log;
    this.exec = exec;
    this.chalk = chalk;
    this.register(this.type);
  }

  getDefaultEvents(eventsNames) {
    return eventsNames.reduce((memo, eventName) => {
      memo[`${eventName}CheckTask`] = defaultEvents[`${eventName}CheckTask`];
      return memo;
    }, {});
  }

  register(type) {
    Object.keys(this.checkEvents).forEach((event) => {
      this.on(type, () => this.checkEvents[event](this));
    });
  }

  forbiddenCommit() {
    this.isCommit = false;
  }

  async checkStart() {
    log(chalk.green('开始代码检测***************************'));
    await this.emit(this.type);
    this.checkEnd();
  }

  checkEnd() {
    if (!this.isCommit) process.exit(1);
    log(chalk.green('检测通过***************************'));
    process.exit(0);
  }
}

module.exports = GitChecker;
