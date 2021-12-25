const bunyan = require('bunyan');
const { logPath, botLoggerName } = require('../configs/bot.config.json');

const log = bunyan.createLogger({
  name: botLoggerName,
  streams: [{ path: logPath }],
});

exports.trace = (message) => {
  log.info(message);
};

exports.debug = (message) => {
  log.info(message);
};

exports.info = (message) => {
  log.info(message);
};

exports.warn = (message) => {
  log.info(message);
};

exports.error = (message) => {
  log.info(message);
};

exports.fatal = (message) => {
  log.info(message);
};
