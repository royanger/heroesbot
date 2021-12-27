const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  guildId,
  encounterAccess,
  encounterChannels,
} = require('../configs/bot.config.json');
const logger = require('../libs/logger');
const { MessageEmbed, MessageAttachment } = require('discord.js');

fs.readdirSync('./encounters').forEach((dir) => {
  fs.readdirSync(`./encounters/${dir}`).forEach((file) => {
    let fileName = file.split('.').slice(0, 1).join('');
    module.exports[fileName] = require(path.join(
      __dirname,
      `../encounters/${dir}`,
      file
    ));
  });
});

let lessons = [];

// create object of raids/events with array of encounters based on file system
fs.readdirSync('./encounters').forEach((dir) => {
  let encounters = [];
  fs.readdirSync(`./encounters/${dir}`).forEach((file) => {
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
    //  let channel = Member.voice.channel;
    //  let role = Guild.roles.cache.get(lfgRole);

    logger.info(`${Member.user.tag} used /encounter`);

    let key = interaction.options.data[0].name;
    let value = interaction.options.data[0].value;

    module.exports[value] = require(path.join(
      __dirname,
      `../encounters/${key}`,
      `${value}.json`
    ));

    // confirm that the user can use command, or that bot is set to 'any'

    // if encounterAcccess in config is set to 'any' bypass these checks.
    if (encounterAccess !== 'any') {
      let memberRoles = Member.roles.cache.map((role) => {
        return role.id;
      });

      let results = [];
      for (let i = 0; i < encounterAccess.length; i++) {
        for (let j = 0; j < memberRoles.length; j++) {
          if (memberRoles[j] === encounterAccess[i])
            results.push(memberRoles[j]);
        }
      }

      // if results > 0, user has at least one role from the list
      // otherwise, error out and message user
      if (results.length < 1) {
        logger.info(
          `${Member.user.tag} tried to use /encounter but does not have the access`
        );
        await interaction.reply({
          content: `You can not use that command.`,
          ephemeral: true,
        });
        return;
      }
    }

    // confirm that bot can use 'any'', or user used correct channel

    //  console.log(module.exports);
    //  console.log(module.exports[value].images);

    // start building the embed
    const embed = [];

    // create first message
    // TODO handle no image
    embed.push(
      new MessageEmbed()
        .setTitle(module.exports[value].name)
        .setColor('#3BA55C')
        .setDescription(`${module.exports[value].content}\n\n`)
        .setImage(`attachment://${module.exports[value].images[0]}`)
    );

    // add addition parts if there are 2+ images
    if (module.exports[value].images.length > 1) {
      module.exports[value].images.slice(1).map((item, index) => {
        embed.push(
          new MessageEmbed()
            .setTitle(`${module.exports[value].name} - Part ${index + 2}`)
            .setColor('#3BA55C')
            .setDescription('Additional image for encounter')
            .setImage(`attachment://${item}`)
        );
      });
    }

    // handle images
    if (module.exports[value].images.length > 0) {
      // there is at least one image, so build array of images
      let images = [];
      module.exports[value].images.map((image) => {
        images.push(new MessageAttachment(`./images/${image}`));
      });
      interaction.channel.send({
        embeds: embed,
        files: images,
      });
    } else {
      // no images, so don't try and include theme
      interaction.channel.send({
        embeds: embed,
      });
    }

    // message user with commands
    interaction.reply({
      content: `Encounter information posted to channel`,
      // content: 'test',
      ephemeral: true,
    });
  },
};
