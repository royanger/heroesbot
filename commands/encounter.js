const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildId, botName } = require('../configs/bot.config.json');
const logger = require('../libs/logger');

fs.readdirSync('./teach').forEach((dir) => {
  fs.readdirSync(`./teach/${dir}`).forEach((file) => {
    let fileName = file.split('.').slice(0, 1).join('');
    module.exports[fileName] = require(path.join(
      __dirname,
      `../teach/${dir}`,
      file
    ));
  });
});

let lessons = [];

// create object of raids/events with array of encounters based on file system
fs.readdirSync('./teach').forEach((dir) => {
  let encounters = [];
  fs.readdirSync(`./teach/${dir}`).forEach((file) => {
    encounters.push(file.split('.').slice(0, 1).join(''));
  });
  lessons[dir] = encounters;
});

// add /encounter command
let data = new SlashCommandBuilder()
  .setName('encounter')
  .setDescription(`Provide information about encounter`);

// iterate over the various event types and add subcommands for each
Object.keys(lessons).map((raid) => {
  data.addStringOption((option) => {
    option.setName(raid).setDescription(`Encounters for ${raid}`);
    lessons[raid].map((encounter) => {
      option.addChoice(module.exports[encounter].name, encounter);
    });
    return option;
  });
});

module.exports = {
  data,
  async execute(interaction, client) {
    let userId = interaction.user.id;
    let Guild = client.guilds.cache.get(guildId);
    let Member = Guild.members.cache.get(userId);

    logger.info(`${Member.user.tag} used /hero`);

    // message user with commands
    interaction.reply({
      content: `Teach something`,
      ephemeral: true,
    });
  },
};
