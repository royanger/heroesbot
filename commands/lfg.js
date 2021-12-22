const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lfg')
    .setDescription('Create an LFG post'),
  async execute(interaction) {
    await interaction.reply('Holy LFG Batman!!');
  },
};
