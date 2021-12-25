const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./configs/bot.config.json');
const activities = require('./configs/activity.config.json');
const logger = require('./libs/logger');

// create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

// load events and their associated loggers
const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// simple command to reply to a message
client.on('messageCreate', (message) => {
  if (message.content === 'test') {
    message.reply({
      content: 'This is a reply',
    });
  }
});

// load commands and their associated handlers
client.commands = new Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async (interaction) => {
  //  randomly update bot activity
  let random = Math.floor(Math.random() * activities.length);
  client.user.setActivity(activities[random].name, {
    type: activities[random].type,
  });
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    logger.error('There was an error while executing this command.');
    return interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

// login to discord and set random activity
try {
  client.login(token).then(() => {
    // randomly set bot activity
    let random = Math.floor(Math.random() * activities.length);
    client.user.setActivity(activities[random].name, {
      type: activities[random].type,
    });
  });
} catch (error) {
  logger.fatal('Could not login into server');
}
