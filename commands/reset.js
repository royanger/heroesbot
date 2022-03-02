const { SlashCommandBuilder } = require("@discordjs/builders");
const logger = require("../libs/logger");
const {
  guildId,
  voiceChannelDefaultSize,
  voiceChannelPrefix,
} = require("../configs/bot.config.json");

// add /reset to reset all LFG channels to size 6
let data = new SlashCommandBuilder()
  .setName("reset")
  .setDescription(
    "Reset all channels currently not in use to size 6 (the default)."
  );

module.exports = {
  data,
  async execute(interaction, client) {
    let userId = interaction.user.id;
    let Guild = client.guilds.cache.get(guildId);
    let Member = Guild.members.cache.get(userId);

    // get nickname if present, otherwise fall back to username
    let displayName =
      Member.nickname !== null ? Member.nickname : Member.user.username;

    // filter first for voice and then for channels that match 'voiceChannelPrefix
    const lfgChannels = Guild.channels.cache
      .filter((channel) => channel.type === "GUILD_VOICE")
      .filter(
        (channel) =>
          channel.name.split(" ")[0].toLowerCase() === voiceChannelPrefix
      );

    // filter to get empty channels, then reset to default size
    lfgChannels
      .filter((channel) => channel.members.size === 0)
      .map((channel) => channel.setUserLimit(voiceChannelDefaultSize));

    // message user to confirm command was executed
    interaction.reply({
      content: "You have reset empty Fireteam channels to their default size",
      ephemeral: true,
    });

    logger.info(`${displayName} reset empty channels to default size`);
  },
};
