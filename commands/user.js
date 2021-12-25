const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription("Replies with user's info!"),
  async execute(interaction) {
    await interaction.reply('User info.');
  },
};
