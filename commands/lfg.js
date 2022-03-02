const { SlashCommandBuilder } = require("@discordjs/builders");
const events = require("../configs/events.config.json");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const {
  guildId,
  lfgChannel,
  lfgRole,
  voiceChannelPrefix,
} = require("../configs/bot.config.json");
const logger = require("../libs/logger");

// add /lfg command
let data = new SlashCommandBuilder()
  .setName("lfg")
  .setDescription("Create an LFG post");

// iterate over the various event types and add subcommands for each
events.map((event) => {
  data.addIntegerOption((optionType) =>
    optionType.setName(event.name).setDescription(event.description)
  );
});

// add 'string' option for optional message to be included in LFG post.
data.addStringOption((option) =>
  option
    .setName("message")
    .setDescription("The message to be included in the LFG post.")
);

module.exports = {
  data,
  async execute(interaction, client) {
    let userId = interaction.user.id;
    let Guild = client.guilds.cache.get(guildId);
    let Member = Guild.members.cache.get(userId);
    let channel = Member.voice.channel;
    let role = Guild.roles.cache.get(lfgRole);

    // grab the user supplied message, if there was one
    let filteredMessage = interaction.options.data.filter((option) => {
      return option.name === "message";
    });

    // confirm that the user only submitted one message
    let userMessage =
      filteredMessage.length === 1 ? filteredMessage[0] : "blank";

    // check that the user entered a valid activity
    if (interaction.options.data.length < 1) {
      logger.info(`${Member.user.tag} did not enter any options`);
      await interaction.reply({
        content: `You must enter a valid option.`,
        ephemeral: true,
      });
      return;
    }

    // get nickname if present, otherwise fall back to username
    let displayName =
      Member.nickname !== null ? Member.nickname : Member.user.username;

    // grab info about the channel member is in and event
    let selectedEvent = events.filter((obj) => {
      return obj.name === interaction.options.data[0].name;
    });
    let partySize =
      selectedEvent[0].name !== "other" ? selectedEvent[0].size : 6;

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

    // check if member is connected to a voice channel
    if (!Member.voice.channel) {
      logger.info(`${Member.user.tag} was not connected to a voice channel.`);
      await interaction.reply({
        content: `You must join a Voice Channel before using this command.`,
        ephemeral: true,
      });
      return;
    }

    // check that the member is in the right voice channels
    // use voiceChannelPrefix from config
    let vcName = channel.name;
    let regEx = "^" + voiceChannelPrefix;
    let regex = new RegExp(regEx, "i");

    if (!vcName.match(regex)) {
      logger.info(`${Member.user.tag} was not connected to an LFG channel`);
      await interaction.reply({
        content: `You must join one of the LFG channels. They begin with **${voiceChannelPrefix}**`,
        ephemeral: true,
      });
      return;
    }

    // check that the option was not just the message
    if (interaction.options.data[0].name === "message") {
      logger.info(`${Member.user.tag} entered only a 'message' option`);
      await interaction.reply({
        content: `You cam not enter only a message option. Please select an activity first.`,
        ephemeral: true,
      });
      return;
    }

    // check that the message was not blank
    // we can't use the .setRequired(true) as the message should logically come after
    // the activity and the activity is optional (so you can select one and not all)
    if (userMessage === "blank") {
      logger.info(`${Member.user.tag} did not enter a message`);
      await interaction.reply({
        content: `You must enter a message`,
        ephemeral: true,
      });
      return;
    }

    let invite = await channel.createInvite({
      maxAge: 1200,
      maxUses: 20,
      reason: "LFG Invite",
    });

    // change voice channel size to match event party size
    channel.setUserLimit(partySize);
    logger.info(`Changed ${channel.name} to size of ${partySize}`);

    // format name - remove _ and capitalize
    let formattedName = selectedEvent[0].name
      .split("_")
      .map((name) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
      })
      .join(" ");

    const message =
      selectedEvent[0].name !== "other"
        ? `${role}\n\n**${displayName} is looking for ${interaction.options.data[0].value} for ${formattedName}**\n\n${userMessage.value}
          \n\nLight Level: ${selectedEvent[0].lightLevel}\n\n`
        : `${role}\n\n**${displayName} is looking for ${interaction.options.data[0].value} for the following activity:**\n\n${userMessage.value}\n\n`;

    // create rich embed
    const embed = new MessageEmbed()
      .setTitle("Looking for Group")
      .setColor("#3BA55C")
      .setDescription(message)
      .setURL(invite.url);

    // create row and button for event link
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Join Voice Channel")
        .setStyle("LINK")
        .setURL(invite.url)
    );

    // send the message, get the id and create thread
    interaction.channel
      .send({ embeds: [embed], components: [row] })
      .then(async (res) => {
        let messageId = res.id;

        let thread = await interaction.channel.threads.create({
          name: `${selectedEvent[0].name} with ${displayName}`,
          autoArchiveDuration: 60,
          startMessage: messageId,
        });
        //if (thread.joinable)
        await thread.members.add(userId);
        await thread.send(`Who from ${role} wants to join?\n\n${invite.url}`);
      });

    // message user to confirm LFG was created
    interaction.reply({
      content: `You've created an LFG post!`,
      ephemeral: true,
    });
    logger.info(`${Member.user.tag} posted an LFG successfully`);
  },
};
