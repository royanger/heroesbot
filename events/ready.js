const logger = require('../libs/logger');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    logger.info(`Client ready. Logged in as ${client.user.tag}`);
  },
};
