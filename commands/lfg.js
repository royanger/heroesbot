const { SlashCommandBuilder } = require('@discordjs/builders');
const events = require('../configs/events.config.json');

let test;

Object.keys(events).map((type) => {
  test += `.addSubcommand(subcommand =>
      subcommand
         .setName(${type})
         .setDescription('Select ${type} as your activity')
         .addUserOption(option => option.setName('test').setDescription('This is a test'))
   )`;
});

let test2 = `new SlashCommandBuilder()
.setName('lfg')
.setDescription('Create an LFG post')`;

let test3 = test2 + test;
console.log(test3);

module.exports = {
  data: test3,
  //   data: new SlashCommandBuilder()
  //     .setName('lfg')
  //     .setDescription('Create an LFG post')

  //  .addSubcommand((subcommand) =>
  //    subcommand
  //      .setName('raid')
  //      .setDescription('Select "raid" as your activity')
  //      .addUserOption((option) =>
  //        option.setName('test').setDescription('This is a test')
  //      )
  //  ),
  //  .addStringOption(type =>
  //    type.setName('event type')
  //       .setDescription('The type of event. IE, raid or pvp')
  //       .setRequired(true)
  //    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'raid') {
      await interaction.reply('raid type selected');
    } else if (interaction.options.getSubcommand() === 'pvp') {
      await interaction.reply('pvp type selected');
    } else {
      console.log(Object.keys(events));
      await interaction.reply('Holy LFG Batman!!');
    }
  },
};
