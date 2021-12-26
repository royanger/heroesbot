const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildId, botName } = require('../configs/bot.config.json');
const logger = require('../libs/logger');
const { MessageEmbed, MessageAttachment } = require('discord.js');

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

    logger.info(`${Member.user.tag} used /encounter`);

    let key = interaction.options.data[0].name;
    let value = interaction.options.data[0].value;

    module.exports[value] = require(path.join(
      __dirname,
      `../teach/${key}`,
      `${value}.json`
    ));

    console.log(module.exports);
    console.log(module.exports[value]);

    console.log('name', interaction.options.data[0].name);
    console.log('content', interaction.options.data[0].content);

    // create rich embed
    const file = new MessageAttachment('./images/lw-wish-wall-01.png');
    const embed = new MessageEmbed()
      .setTitle(module.exports[value].name)
      .setColor('#3BA55C')
      .setDescription(
        `${module.exports[value].name}\n\n${module.exports[value].content}\n\n`
      )
      .setImage('attachment://lw-wish-wall-01.png');
    // .setURL(invite.url);

    // create row and button for event link
    // const row = new MessageActionRow().addComponents(
    // new MessageButton()
    //   .setLabel('Join Voice Channel')
    //   .setStyle('LINK')
    //   .setURL(invite.url)
    // );

    interaction.channel.send({ embeds: [embed], files: [file] });

    // message user with commands
    interaction.reply({
      content: `Encounter information posted to channel`,
      // content: 'test',
      ephemeral: true,
    });
  },
};
