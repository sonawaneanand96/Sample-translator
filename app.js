const tlcfg = require("./tlcfg.json")
const fs = require("fs")
const Eris = require("eris")
const OS = require("os")
const translate = require("google-translate-api")
const lang = require("./langs.json")
const Dbl = require("dblapi.js");
const dbl = new Dbl(tlcfg.dbots);
const Client = new Eris(tlcfg.token, { maxShards: 10, getAllUsers: true, disableEveryone: false })
let guildStatus = require("./functions/guildInfo.js")
let botLists = require("./functions/sendStats.js")
let tsChannels = require("./functions/tsChannels.js")
const prefix = tlcfg.prefix;
let date = new Date()
let month = date.getMonth() + 1;
month = month.toString();
const conn = require("rethinkdbdash")({ port: 28015, host:"localhost", db:"Translate" })
conn.dbCreate("Translate").run()
  .then((res) => console.log("Created new translate database"))
  .error((err) => console.log("Successfully loaded database"))
conn.tableCreate("channels", { primaryKey: "channelID" }).run((e) => { if(e) return })
conn.tableCreate("stats", { primaryKey: "month" }).run((e) => { if(e) return }).then(() => {
  conn.table('stats').get(month).run().then(entry => {
    if (!entry) {
        conn.table('stats')
        .insert({
          month: month,
          characters: "0"
        })
        .run()
        .then(res => console.log("Added new month to database") )
        .error(e => { return });
      } else {
        conn.table('stats')
        .insert({
          month: month,
          characters: "0"
        })
        .run()
        .then(res => console.log("Added new month to database") )
        .error(e => { return });
      }
  });
})

let guildSize = null, shardSize = null, botInit = new Date();

let commands = new Map()
fs.readdir("./commands/", (err, files) => {
  files.forEach(file => {
    if(file.toString().indexOf("_") != 0 && file.toString().includes(".js")){
      let CMD = require(`./commands/${file.toString()}`)
      if (CMD) {
        commands.set(CMD.command, CMD.execute)
      }
    }
  })
})

let upvotes = [];
setInterval(() => getUpvotes(), 10000) // get Upvotes once every 10 seconds

Client.on("ready", () => {
  let readyTime = new Date(), startTime = Math.floor( (readyTime - botInit) / 1000), userCount = Client.users.size
  console.log(`Client ONLINE. ${Client.guilds.size} guilds, serving ${userCount} users.`)
  console.log(`Took ${startTime} seconds to start.`)

  setInterval(newGame, (1000*30))

  guildSize = Client.guilds.size
  shardSize = Client.shards.size

  const gmstr = [
    `${prefix} help | ${userCount} users`,
    `${prefix} help | ${Client.guilds.size} guilds`,
    `${prefix} help | ${prefix} invite`,
    `${prefix} help | ${Client.guilds.size} servers & ${userCount} users! | Want to support Translate"s existence? go here! https://www.patreon.com/TannerReynolds`,
    `${prefix} patreon | ${prefix} invite`,
    `${prefix} patreon`
  ]
  function newGame() {
    let randomNumber = Math.floor(Math.random() * gmstr.length)
    Client.editStatus("online", {
      name: gmstr[randomNumber],
      type: 0
    })
  }
  Client.editStatus("online", {
    name: `${prefix} help | ${Client.guilds.size} servers & ${userCount} users! | Want to support Translate"s existence? go here! https://www.patreon.com/TannerReynolds`,
    type: 0
  })
})

Client.on("guildCreate", guild => {
  guildStatus.update(Client, guild, true);
  guildSize = Client.guilds.size
  shardSize = Client.shards.size
})

Client.on("guildDelete", guild => {
  guildStatus.update(Client, guild, false);
  guildSize = Client.guilds.size
  shardSize = Client.shards.size
})

Client.on("messageCreate", async msg => {
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
    guildStatus = require("./functions/guildInfo.js")
    botLists = require("./functions/sendStats.js")
    tsChannels = require("./functions/tsChannels.js")
  }
 if(msg.author.bot) return
 await conn.table("channels").get(msg.channel.id).run().then(async tRes => {
  if (!tRes) return
  if (msg.channel.id !== tRes.channelID || msg.content.toLowerCase().startsWith(":t")) return
  if (msg.content.startsWith("<") && msg.content.endsWith(">") || msg.content.startsWith("<")) return
  if (msg.content == "" || msg.content == null || msg.content == undefined) return
  return await translate(msg.content).then(async res => {
    let charCount
    await conn.table('stats').get(month).run().then(entry => {
      if(!entry) return
      charCount = entry.characters
    })
    charCount = parseInt(charCount) + msg.content.length
    let replaced = {
      month: month,
      characters: charCount.toString()
    }
    await conn.table('stats').get(month).replace(replaced).run()
    let iso1 = tRes.firstLang.replace(/[()]+/, "")
    let iso2 = tRes.secondLang.replace(/[()]+/, "")
    await translate(msg.content, {
      to: ((res.from.language.iso === iso1) ? iso2 : iso1)
    }).then(async reso => {
      if (reso.text.length > 200) {
        return await msg.channel.createMessage(`**${msg.author.username}#${msg.author.discriminator}**: ${reso.text}`)
      }
      return await msg.channel.createMessage({embed:{
        color: 0xFFFFFF,
        author: { name: `${msg.author.username}#${msg.author.discriminator}`, icon_url: msg.author.avatarURL },
        description: `${reso.text}`
      }})
    })
  })
})

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toString().toLowerCase();
    tsChannels.translate(Client, msg, args, command, conn)
    if(msg.content.toLowerCase().indexOf(prefix) !== 0) return;
  let CMD = commands.get(command)
  if (CMD) {
    if(CMD.command === "channel" && await upvote(msg.author.id) === false) return msg.channel.createMessage({embed: { color:0x36393E, title: "You must upvote Translate to use this command!", fields: [{name: "Upvote URL", value: "https://discordbots.org/bot/318554710929833986/vote"}], footer: {text: "Once you upvote this bot, you will have access to this command"}  }});
    return await CMD(Client, msg, args, conn)
  }

  if(msg.content.toLowerCase().indexOf(prefix + " ") == 0){
    let charCount
    await conn.table('stats').get(month).run().then(entry => {
      if(!entry) return
      charCount = entry.characters
    })
    charCount = parseInt(charCount) + msg.content.length
    let replaced = {
      month: month,
      characters: charCount.toString()
    }
    await conn.table('stats').get(month).replace(replaced).run()
    return await require("./commands/_translate.js").execute(Client, msg, args, command, conn)
  }

})

async function getUpvotes() {
  try {
    await dbl.getVotes(true, 7).then(votes => upvotes = votes );
  } catch (e) {
    return;
  }
}

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

Client.connect()



// Bot lists update every hour //
setInterval(() => { return botLists.send(guildSize, shardSize) }, 1800000)

// ERROR HANDLING //
process.on("unhandledRejection", (reason)=>{ console.log("unhandledRejection\n" + reason.stack); return; })
process.on("uncaughtException", (err)=>{ console.log("uncaughtException\n" + err.stack); return; })
