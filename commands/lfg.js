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
    let userId = interaction.user.id;
    let Guild = client.guilds.cache.get(guildId);
    let Member = Guild.members.cache.get(userId);

    // let channel
    // let errorMessage

    if (Member.voice.channel) {
      let channel = Member.voice.channel;

      let selectedEvent = events.filter((obj) => {
        return obj.abbreviation === interaction.options.data[0].name;
      });
      console.log(selectedEvent[0]);

      let invite = await channel.createInvite({
        maxAge: 600,
        maxUses: 20,
        reason: 'LFG Invite',
      });

      await interaction.reply(
        `LFG Command successful\nUser: ${Member.user.tag}\nChannel: ${
          channel.name
        } (${channel.id})\nCurrent Channel size: ${
          channel.userLimit
        }\n\n\nEvent (by abbreviation): ${
          interaction.options.data[0].name
        }\nEvent Name: ${selectedEvent[0].name}\nEvent Light Level: ${
          selectedEvent[0].lightLevel
        }\nParty Size: ${selectedEvent[0].size}\n\nCurrent Party Size: ${
          interaction.options.data[0].value
        }\nTarget Party Size: ${selectedEvent[0].size}\nNeed: ${
          selectedEvent[0].size - interaction.options.data[0].value
        }\nInvite Code: ${invite.code}`
      );
    } else {
      // The member is not connected to a voice channel.
      // errorMessage = 'You must join a Voice Channel before using this command.';
      await interaction.reply(
        `You must join a Voice Channel before using this command.`
      );
    }
  },
};
