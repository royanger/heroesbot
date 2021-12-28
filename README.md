# Helpless Heroes Discord Bot

This is a bot designed for the Helpless Heroes clan discord.

## Commands

| Command      | Required Options                | Optional             | Results                                                      |
| ------------ | ------------------------------- | -------------------- | ------------------------------------------------------------ |
| `/commands`  |                                 |                      | List of all commands                                         |
| `/lfg`       | `<event>: <current party size>` | `message: <message>` | Create an LFG post.                                          |
| `/encounter` | `<activity>: <encounter>`       |                      | Create a message with details and images about the encounter |

## Configuring the Bot

### Config

You will need to create a `configs/bot.config.json` file and include details from the `configs/bot.config.sample.json` file. The `bot.config.sample.json` contains notes on what each field is for. Please consult that for more information.

### Events

You will find a `configs/event.config.json` file. Here you can configure all events that you want people to be able to LFG for. You can create your own clan specific events if you want.

The format looks like:

```js
[
  {
    name: 'vault_of_glass',
    description: 'Vault of Glass - 6 person raid, 1300 LL',
    size: 6,
    lightLevel: '1300',
  },
  {
    name: 'master_vault_of_glass',
    description: 'Master Vault of Glass - 6 person raid, 1360 LL',
    size: 6,
    lightLevel: '1360',
  },
];
```

All fields are mandatory. The `name` field is effectively the name that is used for selection. Unfortunately Discord does not allow spaces for this field.

### Activities

Every time the bot starts or the /lfg command is run, the activity status of the bot is updated. It is randomly chosen from the `activity.config.json` file. The format is as follows:

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

### Encounters

Populating the data for the `/encounter` command is a two step process.

#### Images

Create and save all images you will want to use. Place them in the /images folder. Spaces in the file name will result in errors.

#### Configuring the command

For each raid or encounter you will need to create a directory without spaces. If you wanted to add information for the Vault of Glass raid then the directory should probably be 'vault-of-glass'. This is used as the name shown when using the command.

For each encounter you will need to create a file in the /encounters directory. You can control the order that the encounters show in discord with numbers at the front. IE '01-wishing-wall.json' will show up first and '02-kalli.json' will be second.

For Vault of Glass you might end up with:

```
vault-of-glass/
   - 01-waking-ruins.json
   - 02-secret-chest.json
   - 03-confluxes.json
   - 04-oracles.json
   - 05-templar.json
   - 06-gorgons-maze.json
   - 07-jumping-puzzle.json
   - 08-gatekeeps.json
   - 09-atheon.json
```

Ultimately the files name don't matter. This just makes sense for organizing and managing them.

The content of the file will look like:

```js
{
  "name": "Waking the Ruins",
  "content": [
    "Mechanics: Vex Sync Plates\n\nSynopsis:\n• Capture three Vex Sync Plates.\n• Prevent the Vex from retaking the Vex Sync Plates.\n\nThe fireteam will spawn looking up at the door to the Vault of Glass in what used to be a public area on Venus, the Waking Ruins.  There is a Vex Sync Plate on the left, in front of the door, and on the right.  Send two players to capture each plate.\n\nBegin by standing in each plate to capture it; it’s not required to stay in the plates once captured. Meanwhile Vex will begin spawning. The smaller Goblin and Hobgoblin units cannot retake the plates, only the Praetorian Minotaurs.  Focus on killing these Praetorians before they reach the plates.  Their spawn will alternate between points on opposite sides of each plate.\n\nProgress can be tracked by looking back towards the spawn point at the Spire which will be forming inside a Vex latticework. The more physical it becomes, the closer the Vault is to opening.  If any of the plates are deactivated by Praetorians, the spire will rapidly disassemble.  When it’s fully built, the enemies will despawn, and a white laser will shoot from the Spire to open the door."
  ],
  "images": ["vog-waking-ruins-01.png"]
}
```

Both content and images are optional. If you create a file with no content section it will just show images. If you have no images it will just show content. The images and the content need to be provided as an array.

**Limitations**

The content sections have some size limitations. Each content block in the array must be 4096 characters long or smaller. Total character length of all content sections must be under 6000 characters.

## Running the Bot

### Deploying Commands

Anytime you add new commands or update the existing commands, you may need to redeploy the commands to the discord server. Use `npm run commands` to deploy the commands via the `deploy-commands.js` script.

### Starting the Bot

In development, use the following command to run the bot.

`npm run dev`

When doing so you should see `Client ready to log into discord` appear in your console and the bot should log on inside Discord.

For production, you could use `npm start` but it is recommended to instead use something like pm2 for managing the bot.
