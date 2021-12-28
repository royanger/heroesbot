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

    // if encounterChannels in config is set to 'any' bypass these checks.
    if (encounterChannels !== 'any') {
      let results = [];
      for (let i = 0; i < encounterChannels.length; i++) {
        if (encounterChannels[i] === interaction.channelId)
          results.push(encounterChannels[i]);
      }

      // if results > 0, user is in the correct text channel
      // otherwise, error out and message user
      if (results.length < 1) {
        logger.info(
          `${Member.user.tag} tried to use /encounter but was in the wrong channel`
        );
        await interaction.reply({
          content: `You can not user /encounter in this channel. Correct channels: ${encounterChannels.map(
            (channel) => {
              return ` ${Guild.channels.cache.get(channel)}`;
            }
          )}`,
          ephemeral: true,
        });
        return;
      }
    }

    // start building the embed
    const embed = [];

    // create first message
    let newEmbed = new MessageEmbed()
      .setTitle(module.exports[value].name)
      .setColor('#3BA55C');

    if (module.exports[value].content) {
      newEmbed.setDescription(`${module.exports[value].content[0]}\n\n`);
    } else {
      newEmbed.setDescription('No written information. Please see image');
    }

    // confirm that there is at least one image before trying to add it
    if (module.exports[value].images) {
      newEmbed.setImage(`attachment://${module.exports[value].images[0]}`);
    }
    embed.push(newEmbed);

    // add additional parts if there are 2+ images or 2+ content sections
    if (
      (module.exports[value].images &&
        module.exports[value].images.length > 1) ||
      (module.exports[value].content &&
        module.exports[value].content.length > 1)
    ) {
      // get longest length of array from content or images
      let length;
      if (module.exports[value].images && module.exports[value].content) {
        length =
          module.exports[value].images.length >
          module.exports[value].content.length
            ? module.exports[value].images.length
            : module.exports[value].content.length;
      }

      if (module.exports[value].images && !module.exports[value].content) {
        length = module.exports[value].images.length;
      }

      if (!module.exports[value].images && module.exports[value].content) {
        length = module.exports[value].images.content;
      }

      // create .map equal to longest array length
      let count = new Array(length - 1);
      [...count].map((_, index) => {
        // create the embed
        let supplementalEmbed = new MessageEmbed()
          .setTitle(`${module.exports[value].name} - Part ${index + 2}`)
          .setColor('#3BA55C');

        // if there is both content and an image for this pass, add both
        if (
          module.exports[value].images &&
          module.exports[value].images[index + 1] &&
          module.exports[value].content &&
          module.exports[value].content[index + 1]
        ) {
          supplementalEmbed
            .setDescription(`${module.exports[value].content[index + 1]}`)
            .setImage(
              `attachment://${module.exports[value].images[index + 1]}`
            );
        } else {
          // if there is only an image or only content, handle that

          // if there is content and no image, add content
          if (
            module.exports[value].content &&
            module.exports[value].content[index + 1]
          ) {
            supplementalEmbed.setDescription(
              `${module.exports[value].content[index + 1]}`
            );
          }

          // if there is an image and no content, add image
          if (
            module.exports[value].images &&
            module.exports[value].images[index + 1]
          ) {
            supplementalEmbed
              .setDescription('Additional image for encounter')
              .setImage(
                `attachment://${module.exports[value].images[index + 1]}`
              );
          }
        }
        embed.push(supplementalEmbed);
      });
    }

    // handle images attaching images and then sending embed
    if (module.exports[value].images) {
      // there is at least one image, so build array of images and send
      let images = [];
      module.exports[value].images.map((image) => {
        images.push(new MessageAttachment(`./images/${image}`));
      });
      interaction.channel.send({
        embeds: embed,
        files: images,
      });
    } else {
      // no images, so don't try and include them and just send
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
