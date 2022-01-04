const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const logger = require('../libs/logger');
const { guildId } = require('../configs/bot.config.json');
const silliness = require('../configs/silliness.config.json');

// add /silliness command
let data = new SlashCommandBuilder()
  .setName('silliness')
  .setDescription(
    "Roll for a random way to complete a dungeon, strike, raid or whatever you're up to."
  );

module.exports = {
  data,
  async execute(interaction, client) {
    let userId = interaction.user.id;
    let Guild = client.guilds.cache.get(guildId);
    let Member = Guild.members.cache.get(userId);

    const selection = Math.ceil(Math.random() * silliness.length) - 1;
    const actionSelection =
      Math.ceil(Math.random() * silliness[selection].options.length) - 1;

    console.log('action selections', actionSelection);

    let message = `${Member.user.tag} rolled the magic Destiny hopper.\n\n**Result**: ${silliness[selection].action} ${silliness[selection].options[actionSelection]}`;

    // create rich embed
    const embed = new MessageEmbed()
      .setTitle('Coin Flip!')
      .setColor('#3BA55C')
      .setDescription(message);

    interaction.channel.send({ embeds: [embed] });
    // message user to confirm command was executed
    interaction.reply({
      content: 'You flirted with destiny. Hopefully you have a little fun',
      ephemeral: true,
    });

    logger.info(
      `${Member.user.tag} tempted destiny and rolled for some silliness`
    );
  },
};
