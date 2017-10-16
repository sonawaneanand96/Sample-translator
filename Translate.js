const tlcfg = require('./tlcfg.json'),
      fs = require('fs'),
      Eris = require("eris"),
      bot = new Eris(tlcfg.token, { maxShards: 4 }),
      guild_status = require('./extras/guild_info.js'),
      botLists = require('./extras/send_stats.js'),
      cmd_prefix = tlcfg.prefix;
let   guild_size = null, shard_size = null, bot_init = new Date();
console.log('Connecting...');
process.on('unhandledRejection', (reason)=>{ console.log("unhandledRejection\n" + reason); return; });
process.on('uncaughtException', (err)=>{ console.log("uncaughtException\n" + err); return; });
var command_locations = [];
var commands = [];
fs.readdir("./commands/", (err, files) => {
  files.forEach(file => {
    if(file.toString().indexOf("_") != 0 && file.toString().includes(".js")){
      command_locations.push("./commands/" + file.toString());
      commands.push(require("./commands/" + file.toString()));
    }
  });
});
bot.on("ready", () => {
  let ready_time = new Date(), start_time = Math.floor((ready_time-bot_init)/1000), userCount = bot.users.size;
  bot.editStatus('online', {
    name: `${cmd_prefix} help | ${bot.guilds.size} servers & ${userCount} users! | Want to support Translate's existence? go here! https://www.patreon.com/TannerReynolds`,
    type: 0
  });
  console.log(`Bot ONLINE. ${bot.guilds.size} guilds, serving ${userCount} users.`);
  console.log(`Took ${start_time} seconds to start.`);
  const gmstr = [
    `${cmd_prefix} help | ${userCount} users`,
    `${cmd_prefix} help | ${bot.guilds.size} guilds`,
    `${cmd_prefix} help | ${cmd_prefix} invite`,
    `${cmd_prefix} help | ${bot.guilds.size} servers & ${userCount} users! | Want to support Translate's existence? go here! https://www.patreon.com/TannerReynolds`,
    `${cmd_prefix} patreon | ${cmd_prefix} invite`,
    `${cmd_prefix} patreon`
  ]
  setInterval(newGame, (1000*30));
  function newGame() {
    var randomNumber = Math.floor(Math.random() * gmstr.length);
    bot.editStatus('online', {
      name: `${gmstr[randomNumber]}`,
      type: 0
    });
  }
  guild_size = bot.guilds.size; shard_size = bot.shards.size; botLists.send(guild_size, shard_size);
});
bot.on('guildCreate', guild => {
  guild_status.update(bot,guild,true);
  guild_size = bot.guilds.size; shard_size = bot.shards.size; botLists.send(guild_size, shard_size);
});
bot.on('guildDelete', guild => {
  guild_status.update(bot,guild,false);
  guild_size = bot.guilds.size; shard_size = bot.shards.size; botLists.send(guild_size, shard_size);
});
bot.on("messageCreate", async (msg) => {
  if(msg.author.bot) return;
  if(msg.content.indexOf(cmd_prefix) !== 0) return;
  const args = msg.content.slice(cmd_prefix.length).trim().split(/ +/g);
  const command = args.shift().toString().toLowerCase();
  for(i=0;commands.length>i;i++){
    if(commands[i].command == command){
      return await commands[i].execute(bot, msg, args);
      break;
    }
  }
  if(msg.content.indexOf(cmd_prefix + " ") == 0){
    return require('./commands/_translate.js').execute(bot, msg, args, command);
  }
});

bot.connect();
