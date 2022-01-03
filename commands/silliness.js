const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const logger = require('../libs/logger');
const { guildId } = require('../configs/bot.config.json');

// add /lfg command
let data = new SlashCommandBuilder()
  .setName('silliness')
  .setDescription(
    'Flip a coin. Will it be heads or tails? (Or something else?)'
  );

module.exports = {
  data,
  async execute(interaction, client) {
    let userId = interaction.user.id;
    let Guild = client.guilds.cache.get(guildId);
    let Member = Guild.members.cache.get(userId);

    const roll = Math.ceil(Math.random() * 100);

    let results;
    let image;
    let easterEgg = false;
    if (roll === 25 || roll === 75) {
      results = 'an easter egg!';
      image = 'magic.gif';
      easterEgg = true;
    } else if (roll < 51) {
      results = 'heads';
      image = 'coin-heads.png';
    } else {
      results = 'tails';
      image = 'coin-tails.png';
    }
    let message = `**${Member.user.tag}** flipped a coin and the result was **${results}**\n\n`;

    // create rich embed
    const embed = new MessageEmbed()
      .setTitle('Coin Flip!')
      .setColor('#3BA55C')
      .setDescription('a silly command');
    // .setImage(`attachment://${image}`);

    //  const imageArray = new MessageAttachment(`./images/${image}`);

    //  interaction.channel.send({ embeds: [embed], files: [imageArray] });

    interaction.channel.send({ embeds: [embed] });
    // message user to confirm LFG was created
    interaction.reply({
      content: `You want some silliness`,
      ephemeral: true,
    });

    logger.info(`${Member.user.tag} flipped a coin`);
  },
};
