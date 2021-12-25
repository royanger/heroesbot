# Helpless Heroes Discord Bot

This is a bot designed for the Helpless Heroes clan discord. The initial (and possibly only) core feature will be an LFG tool.

## Running the Bot

### Config

You will need to create a `configs/bot.config.json` file and include details from the `configs/bot.config.sample.json` file. The `bot.config.sample.json` contains notes on what each field is for. Please consult that for more information.

### Events

You will find a `configs/event.config.json` file. Here you can configure all events that you want people to be able to LFG for. You can create your own clan specific events if you want.

The format is two levels deep. The first level is:

```js
{
  "raids": [],
  "pvp": [],
  "dungeons": []
}
```

Each of the keys (raids, pvp, dungeons) will used as a parameter for the lfg command, creating logical groups.

The second level is the contents of the array, and looks like:

```js
{
  "raids": [
    {
      "name": "Vault of Glass",
      "abbreviation": "vog",
      "size": 6,
      "lightLevel": "1300"
    },
    {
      "name": "Master Vault of Glass",
      "abbreviation": "mvog",
      "size": 6,
      "lightLevel": "1500"
    },
  ],
}
```

All fields are mandatory. The `abbreviation` field can be used with the command to shorten the user input. IE, instead of typing out `garden of salvation` for the raid, they can just type `gos`.

### Activities

Everytime the bot starts or the /lfg command is run, the activity status of the bot is updated. It is randomly chosen from the `activity.config.json` file. The format is as follows:

```js
[
  {
    name: 'Trials of Osiris',
    type: 'COMPETING',
  },
  {
    name: 'Shaxx Sing',
    type: 'LISTENING',
  },
  {
    name: 'Crucible',
    type: 'WATCHING',
  },
];
```

The three types are the only three activity types available. The above will turn into the following:

- Competing in Trials of Osiris
- Listening to Shaxx
- Watching Crucible.

## Starting the Bot

### Deploying Commands

Anytime you add new commands or update the existing commands, you may need to redeploy the commands to the discord server. Use `npm run commands` to deploy the commands via the `deploy-commands.js` script.

### Starting the Bot

In development, use the following command to run the bot.

`npm run dev`

When doing so you should see `Client ready to log into discord` appear in your console and the bot should log on inside Discord.
