const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildId, botName } = require('../configs/bot.config.json');
const logger = require('../libs/logger');

let lessons = [];

// create object of raids/events with array of encounters based on file system
fs.readdirSync('./teach')
  //   .filter((file) => file.endsWith('.js'));
  .forEach((dir) => {
    let encounters = [];
    fs.readdirSync(`./teach/${dir}`).forEach((file) => {
      encounters.push(file.split('.').slice(0, 1).join(''));
    });
    lessons[dir] = encounters;
  });
console.log('=======');
console.log(lessons);

// add /hero command
let data = new SlashCommandBuilder()
  .setName('encounter')
  .setDescription(`Provide information about encounter`);

// iterate over the various event types and add subcommands for each

data.addStringOption((option) =>
  option
    .setName('event')
    .setDescription('test1')
    .addChoice('Wish Wall', 'wish-wall')
    .addChoice('Kalli', 'kalli')
);

console.log('=======');
Object.keys(lessons).map((raid, index) => {
  console.log(raid);
  lessons[raid].map((encounter) => {
    console.log(encounter);
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
