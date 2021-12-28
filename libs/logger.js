const bunyan = require('bunyan');
const { logPath, botLoggerName } = require('../configs/bot.config.json');
const RotatingFileStream = require('bunyan-rotating-file-stream');

const log = bunyan.createLogger({
  name: botLoggerName,
  streams: [
    {
      stream: new RotatingFileStream({
        path: logPath,
        period: '1d', // daily rotation
        totalFiles: 10, // keep up to 10 back copies
        rotateExisting: true, // Give ourselves a clean file when we start up, based on period
        threshold: '10m', // Rotate log files larger than 10 megabytes
        totalSize: '20m', // Don't keep more than 20mb of archived log files
        gzip: true, // Compress the archive log files to save space
      }),
    },
  ],
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
