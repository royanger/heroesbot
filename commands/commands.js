const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildId, botName } = require('../configs/bot.config.json');
const logger = require('../libs/logger');

// add /hero command
let data = new SlashCommandBuilder()
  .setName('commands')
  .setDescription(`Get a list of the ${botName} commands`);

module.exports = {
  data,
  async execute(interaction, client) {
    let userId = interaction.user.id;
    let Guild = client.guilds.cache.get(guildId);
    let Member = Guild.members.cache.get(userId);

    logger.info(`${Member.user.tag} used /hero`);

    let message = `Available commands

/commands - All bot commands
/lfg <type>: <party> - Post lfg. Type selected from list`;

    // message user with commands
    interaction.reply({
      content: message,
      ephemeral: true,
    });
  },
};
