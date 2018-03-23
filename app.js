const tlcfg = require("./tlcfg.json")
const fs = require("fs")
const Eris = require("eris")
const OS = require("os")
const translate = require("google-translate-api")
const lang = require("./langs.json")
const Dbl = require("dblapi.js");
const dbl = new Dbl(tlcfg.dbots);
const bot = new Eris(tlcfg.token, { maxShards: 10, getAllUsers: true, disableEveryone: false })
let guildStatus = require("./functions/guildInfo.js")
let botLists = require("./functions/sendStats.js")
let tsChannels = require("./functions/tsChannels.js")
let singleTChannel = require("./functions/singleChannelTranslations.js")
const prefix = tlcfg.prefix;
let date = new Date()
let month = date.getMonth() + 1;
month = month.toString();
let year = date.getFullYear();
year = year.toString();
let statsEntry = `${month}/${year}`
const conn = require("rethinkdbdash")({ port: 28015, host:"localhost", db:"Translate" })
conn.dbCreate("Translate").run()
  .then((res) => console.log("Created new translate database"))
  .error((err) => console.log("Successfully loaded database"))
conn.tableCreate("channels", { primaryKey: "channelID" }).run((e) => { if(e) return })
conn.tableCreate("stats", { primaryKey: "month" }).run((e) => { if(e) return })

let guildSize = null, shardSize = null, botInit = new Date();

// Gets all command files from ./commands/ //
let commands = new Map()
fs.readdir("./commands/", (err, files) => {
  files.forEach(file => {
    if(file.toString().indexOf("_") != 0 && file.toString().includes(".js")) { // Ignores _translate.js
      let CMD = require(`./commands/${file.toString()}`)
      if (CMD) {
        commands.set(CMD.command, CMD.execute)
      }
    }
  })
})

let upvotes = []; // Checks this array every time a command is ran
setInterval(() => getUpvotes(), 10000) // get Upvotes from discordbots.org once every 10 seconds

bot.on("ready", () => {
  let readyTime = new Date(), startTime = Math.floor( (readyTime - botInit) / 1000), userCount = bot.users.size
  console.log(`bot ONLINE. ${bot.guilds.size} guilds, serving ${userCount} users.`)
  console.log(`Took ${startTime} seconds to start.`)

  guildSize = bot.guilds.size
  shardSize = bot.shards.size

  setInterval(newGame, (1000*30))
  const gmstr = [
    `${prefix} help | ${userCount} users`,
    `${prefix} help | ${bot.guilds.size} guilds`,
    `${prefix} help | ${prefix} invite`,
    `${prefix} help | ${bot.guilds.size} servers & ${userCount} users! | Want to support Translate"s existence? go here! https://www.patreon.com/TannerReynolds`,
    `${prefix} patreon | ${prefix} invite`,
    `${prefix} patreon`
  ]
  function newGame() {
    let randomNumber = Math.floor(Math.random() * gmstr.length)
    bot.editStatus("online", {
      name: gmstr[randomNumber],
      type: 0
    })
  }

  bot.editStatus("online", {
    name: `${prefix} help | ${bot.guilds.size} servers & ${userCount} users! | Want to support Translate"s existence? go here! https://www.patreon.com/TannerReynolds`,
    type: 0
  })
})

bot.on("guildCreate", guild => {
  guildStatus.update(bot, guild, true);
  guildSize = bot.guilds.size
  shardSize = bot.shards.size
})
bot.on("guildDelete", guild => {
  guildStatus.update(bot, guild, false);
  guildSize = bot.guilds.size
  shardSize = bot.shards.size
})

bot.on("messageCreate", async msg => {

  // Creating new table in stats DB per month if one does not exist
  await conn.table('stats').get(statsEntry).run().then(entry => {
    if (!entry) {
        conn.table('stats')
        .insert({
          month: statsEntry,
          characters: "0" // Stores both the month and character count as strings due to NaN issues
        })
        .run()
        .then(res => console.log("Added new month to database") )
        .error(e => { return });
      }
  });

  // Shitty reload stuff I put here as a temporary thing that I refuse to make better //
  if(msg.author.id === "205912295837138944" && msg.content.toLowerCase() === "tr") {
    let commands = new Map()
    fs.readdir("./commands/", (err, files) => {
      files.forEach(file => {
        if(file.toString().indexOf("_") != 0 && file.toString().includes(".js")){
          delete require.cache[require.resolve(`./commands/${file.toString()}`)];
          let CMD = require(`./commands/${file.toString()}`)
          if (CMD) {
            commands.set(CMD.command, CMD.execute)
          }
        }
      })
    })
    delete require.cache[require.resolve("./functions/guildInfo.js")];
    delete require.cache[require.resolve("./functions/sendStats.js")];
    delete require.cache[require.resolve("./functions/tsChannels.js")];
    delete require.cache[require.resolve("./functions/singleChannelTranslations.js")];
    guildStatus = require("./functions/guildInfo.js")
    botLists = require("./functions/sendStats.js")
    tsChannels = require("./functions/tsChannels.js")
    singleTChannel = require("./functions/singleChannelTranslations.js")
  } // End of shitty reload thing //

  if(msg.author.bot) return

  // Defining command vars //
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toString().toLowerCase();

  // First automatic translation channel method (:t channel) //
  singleTChannel.translate(bot, msg, args, command, conn)
  
  // Second automatic translation channel method (ts-channels) //
  tsChannels.translate(bot, msg, args, command, conn)

  // Commands //
  if(msg.content.toLowerCase().indexOf(prefix) !== 0) return;
  let CMD = commands.get(command)
  if (CMD) {
    if(CMD.command === "channel" && await upvote(msg.author.id) === false) return msg.channel.createMessage({embed: { color:0x36393E, title: "You must upvote Translate to use this command!", fields: [{name: "Upvote URL", value: "https://discordbots.org/bot/318554710929833986/vote"}], footer: {text: "Once you upvote this bot, you will have access to this command"}  }});
    return await CMD(bot, msg, args, conn)
  }
  if(msg.content.toLowerCase().indexOf(prefix + " ") == 0){
    
    // Stats updater //
    let charCount
    await conn.table('stats').get(statsEntry).run().then(entry => {
      if(!entry) return
      charCount = entry.characters
    })
    charCount = parseInt(charCount) + msg.content.length
    charCount = charCount.toString();
    let replaced = {
      month: statsEntry,
      characters: charCount
    }
    await conn.table('stats').get(statsEntry).replace(replaced).run()

    // :t [language] command //
    return await require("./commands/_translate.js").execute(bot, msg, args, command, conn)
  }
}) // msg handler end //

// Get upvotes from DBL //
async function getUpvotes() {
  try {
    await dbl.getVotes(true, 7).then(votes => upvotes = votes );
  } catch (e) {
    return;
  }
}

// Get upvotes from upvotes array defined above //
async function upvote(id) {
  let bool
  try {
    if(upvotes.includes(id)) {
      bool = true;
    } else {
      bool = false;
    }
  } catch (e) {
    bool = true;
  }
  return bool
}

bot.connect() // Connect to Discord

// Bot lists update every hour //
setInterval(() => { return botLists.send(guildSize, shardSize) }, 1800000)

// ERROR HANDLING //
process.on("unhandledRejection", e => { console.log(`unhandledRejection\n${e.stack}`); return; })
process.on("uncaughtException", e => { console.log(`uncaughtException\n${e.stack}`); return; })