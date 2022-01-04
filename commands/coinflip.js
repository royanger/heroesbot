const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const logger = require('../libs/logger');
const { guildId } = require('../configs/bot.config.json');

// add /coinflip command
let data = new SlashCommandBuilder()
  .setName('coinflip')
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

    const easterEggs = [
      {
        description: `**${Member.user.tag}** flipped a coin and and found **Dinklebot!**\n\n`,
        image: 'coinflip-easteregg-dinklebot.jpg',
      },
      {
        description: `**${Member.user.tag}** found the 15th Wish! \n\n`,
        image: 'coinflip-easteregg-15thwish.jpg',
      },
      {
        description: `**${Member.user.tag}** loves using The Last Word on bosses!\n\n`,
        image: 'coinflip-easteregg-lastword.jpg',
      },
      {
        description: `**${Member.user.tag}** loves Polaris Lance! Always equipped!\n\n`,
        image: 'coinflip-easteregg-polarislance.jpg',
      },
      {
        description: `**${Member.user.tag}** found the vault where Bungie keeps the bug free Telesto\n\n`,
        image: 'coinflip-easteregg-telesto.jpg',
      },
      {
        description: `**${Member.user.tag}** found a leak. Look at what's coming to Destiny!\n\n`,
        image: 'coinflip-easteregg-touchofmalice.jpg',
      },
    ];

    if (easterEgg) {
      const selection = Math.floor(Math.random() * easterEggs.length);
      message = easterEggs[selection].description;
      image = easterEggs[selection].image;
    }

    // create rich embed
    const embed = new MessageEmbed()
      .setTitle('Coin Flip!')
      .setColor('#3BA55C')
      .setDescription(message)
      .setImage(`attachment://${image}`);

    const imageArray = new MessageAttachment(`./images/${image}`);

    interaction.channel.send({ embeds: [embed], files: [imageArray] });

    // message user to confirm LFG was created
    interaction.reply({
      content: `You flipped the magic Destiny coin`,
      ephemeral: true,
    });

    logger.info(`${Member.user.tag} flipped a coin`);
  },
};
