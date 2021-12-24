const { SlashCommandBuilder } = require('@discordjs/builders');
const events = require('../configs/events2.config.json');

// add /lfg command
let data = new SlashCommandBuilder()
  .setName('lfg-old')
  .setDescription('Create an LFG post');

// iterate over the various event types and add subcommands for each
Object.keys(events).map((type) => {
  // let options

  //   events[type].map((event) => {
  //     console.log(event.name, event.abbreviation);
  //   });

  data.addSubcommand(
    (subcommand) =>
      subcommand
        .setName(type)
        .setDescription(`Select ${type} as your activity`)
        .addStringOption(
          (optionType) =>
            optionType
              .setName(`${type}`)
              .setDescription(`Select your ${type}`)
              .setRequired(true)
              .addChoice('Garden of Salvation', 'gos')
              .addChoice('Last Wish', 'lw')
          // .events[type].map((event) => {
          //   optionType.addChoice(event.name, event.abbreviation);
          // })
        )
    // .addStringOption((option) =>
    //   option
    //     .setName('people')
    //     .setDescription('The number of people you currently have')
    // )
  );

  //   events[type].map((event) => {
  //     console.log(data);
  //     // optionType.addChoice(event.name, event.abbreviation);
  //   });
});
// console.log(data.options[0]);

// data.addStringOption((option) =>
//   option
//     .setName('people')
//     .setDescription('The number of people you currently have')
//     .setRequired(true)
//     .addChoice('1', '1')
//     .addChoice('2', '2')
//     .addChoice('3', '3')
//     .addChoice('4', '4')
//     .addChoice('5', '5')
// );

module.exports = {
  data,
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
