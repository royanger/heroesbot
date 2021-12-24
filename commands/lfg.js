const { SlashCommandBuilder } = require('@discordjs/builders');
const events = require('../configs/events.config.json');
const { guildId } = require('../configs/bot.config.json');

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
    //  interaction.guild.channels.cache.clear();

    //  console.log(await interaction.options.data);
    //  console.log(await interaction);

    //  console.log('========');
    //  console.log('========');
    let userId = interaction.user.id;
    let Guild = client.guilds.cache.get(guildId);
    let Member = Guild.members.cache.get(userId);

    if (Member.voice.channel) {
      console.log(
        `${Member.user.tag} is connected to ${Member.voice.channel.name} ${Member.voice.channel.id}!`
      );
    } else {
      // The member is not connected to a voice channel.
      console.log(`${Member.user.tag} is not connected.`);
    }

    //  let test = Member.guild.channels.cache;

    //  let filteredChannels = test.filter(
    //    (channel) => channel.type === 'GUILD_VOICE'
    //  );
    //  filteredChannels.map((channel) => {
    //    console.log(`CHANNEL  ${channel.name}`);
    //    console.log(channel.members.user.id);
    //  });
    //  console.log('========');
    //  console.log('========');

    //  console.log(
    //    filteredChannels.some((value) => {
    //      console.log(value.members);
    //      value.members === userId;
    //    })
    //  );

    //  console.log('voiceStates for Member');

    //  console.log(Member.voice.channel);

    //  console.log(await interaction.guild.channels.fetch());

    //  let client = await client.guilds.fetch('890296114920718416');

    //  let voiceChannels = await interaction.guild.channels.fetch();

    //  filteredChannels.map((channel) => {
    //    console.log(`CHANNEL  ${channel.name}`);
    //    console.log(channel.members);
    //  });
    //  let test = await client.channels.fetch();
    //  console.log('cleint', test);
    //  client.guilds.channels;

    //  client.channels.cache.clear();

    //  console.log('======== Clearing Cache?');

    //  let voiceChannels2 = await interaction.guild.channels.cache;
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
