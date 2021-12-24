const { SlashCommandBuilder } = require('@discordjs/builders');
const events = require('../configs/events.config.json');

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
    console.log(await interaction.options.data);
    console.log(await interaction.user.username);
    //  console.log(await interaction.guild.channels.fetch());

    //  let client = await client.guilds.fetch('890296114920718416');

    console.log('========');
    console.log('========');
    let test = await client.channels.fetch();
    console.log('cleint', test);
    client.guilds.channels;

    //  client.channels.cache.clear();
    let voiceChannels = await interaction.guild.channels.fetch();

    let filteredChannels = voiceChannels.filter(
      (channel) => channel.type === 'GUILD_VOICE'
    );

    //  filteredChannels.map((channel) => {
    //    console.log(`CHANNEL  ${channel.name}`);
    //    console.log(channel.members);
    //  });

    //  console.log('======== Clearing Cache?');

    //  let voiceChannels2 = await interaction.guild.channels.fetch();
    //  let filteredChannels2 = voiceChannels2.filter(
    //    (channel) => channel.type === 'GUILD_VOICE'
    //  );
    //  filteredChannels2.map((channel) => {
    //    console.log(`CHANNEL  ${channel.name}`);
    //    console.log(channel.members);
    //  });

    console.log('========');
    console.log('========');

    await interaction.reply('Holy LFG TWO Batman!!');
  },
};
