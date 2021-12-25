const { SlashCommandBuilder } = require('@discordjs/builders');
const events = require('../configs/events.config.json');
const {
  guildId,
  lfgChannel,
  lfgRole,
  voiceChannelPrefix,
} = require('../configs/bot.config.json');
const logger = require('../libs/logger');
// const { Message } = require('discord.js');

// add /lfg command
let data = new SlashCommandBuilder()
  .setName('lfg')
  .setDescription('Create an LFG post');

// iterate over the various event types and add subcommands for each
events.map((event) => {
  data.addIntegerOption((optionType) =>
    optionType.setName(event.abbreviation).setDescription(event.name)
  );
});

module.exports = {
  data,
  async execute(interaction, client) {
    let userId = interaction.user.id;
    let Guild = client.guilds.cache.get(guildId);
    let Member = Guild.members.cache.get(userId);
    let channel = Member.voice.channel;
    let role = Guild.roles.cache.get(lfgRole);

    // grab info about the channel member is in and event
    let selectedEvent = events.filter((obj) => {
      return obj.abbreviation === interaction.options.data[0].name;
    });
    let partySize = selectedEvent[0].size;

    // member is not in the correct text channel to use command
    if (interaction.channelId !== lfgChannel) {
      logger.info(
        `${Member.user.tag} used the LFG command in the wrong channel.`
      );
      await interaction.reply({
        content: `You can only use this commend in the ${Guild.channels.cache.get(
          lfgChannel
        )} channel.`,
        ephemeral: true,
      });
      return;
    }

    // member is not connected to a voice channel.
    if (!Member.voice.channel) {
      logger.info(`${Member.user.tag} was not connected to a voice channel.`);
      await interaction.reply({
        content: `You must join a Voice Channel before using this command.`,
        ephemeral: true,
      });
      return;
    }

    // check that the person in the right voice channels
    // use voiceChannelPrefix from config
    let vcName = channel.name;
    let regEx = '^' + voiceChannelPrefix;
    let regex = new RegExp(regEx, 'i');

    if (!vcName.match(regex)) {
      logger.info(`${Member.user.tag} was not connected to an LFG channel`);
      await interaction.reply({
        content: `You must join one of the LFG channels. They begin with **${voiceChannelPrefix}**`,
        ephemeral: true,
      });
      return;
    }

    // check that the member supplied a current party size that is
    // smaller than the event party size.
    // if the current === or > eventy party size no need to lfg
    if (interaction.options.data[0].value > partySize - 1) {
      logger.info(
        `${Member.user.tag} tried to create a LFG post with a party the size of or larger than the event`
      );
      await interaction.reply({
        content: `You said your current party size was ${
          interaction.options.data[0].value
        }. This is ${
          interaction.options.data[0].value === partySize
            ? 'the same size as'
            : 'larger than'
        } the event party size, which is ${partySize} `,
        ephemeral: true,
      });
      return;
    }

    let invite = await channel.createInvite({
      maxAge: 600,
      maxUses: 20,
      reason: 'LFG Invite',
    });

    channel.setUserLimit(partySize);
    logger.info(`Changed ${channel.name} to size of ${partySize}`);

    let displayName =
      Member.nickname !== null ? Member.nickname : Member.user.username;

    interaction.channel.send(
      `${role}\n\n**${displayName} is looking for ${
        selectedEvent[0].size - interaction.options.data[0].value
      } for ${selectedEvent[0].name}** (Light LeveL: ${
        selectedEvent[0].lightLevel
      })\n\n${invite.url}`
    );

    interaction.reply({
      content: `You've created an LFG post!`,
      ephemeral: true,
    });
  },
};
