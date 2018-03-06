const tlcfg = require('./tlcfg.json')
const fs = require('fs')
const Eris = require("eris")
const OS = require('os')
const translate = require('google-translate-api')
const lang = require('./langs.json')
const Client = new Eris(tlcfg.token, { maxShards: 10 })
const guild_status = require('./extras/guild_info.js')
const botLists = require('./extras/send_stats.js')
const cmd_prefix = tlcfg.prefix
const conn = require('rethinkdbdash')({ port: 28015, host:'localhost', db:'Translate' })
conn.dbCreate('Translate').run()
  .then((res) => console.log('Created new translate database'))
  .error((err) => console.log('Successfully loaded database'))
conn.tableCreate('channels', { primaryKey: 'channelID' })
  .run((e) => { if(e) return })

let guild_size = null, shard_size = null, bot_init = new Date();

var commands = new Map()
fs.readdir("./commands/", (err, files) => {
  files.forEach(file => {
    if(file.toString().indexOf("_") != 0 && file.toString().includes(".js")){
      let CMD = require("./commands/" + file.toString())
      if (CMD) {
        commands.set(CMD.command, CMD.execute)
      }
    }
  })
})

let cmdCounts = {characters: 0, ran: 0}

Client.on("ready", () => {
  let ready_time = new Date(), start_time = Math.floor((ready_time-bot_init)/1000), userCount = Client.users.size
  console.log(`Client ONLINE. ${Client.guilds.size} guilds, serving ${userCount} users.`)
  console.log(`Took ${start_time} seconds to start.`)

  setInterval(newGame, (1000*30))

  guild_size = Client.guilds.size
  shard_size = Client.shards.size

  const gmstr = [
    `${cmd_prefix} help | ${userCount} users`,
    `${cmd_prefix} help | ${Client.guilds.size} guilds`,
    `${cmd_prefix} help | ${cmd_prefix} invite`,
    `${cmd_prefix} help | ${Client.guilds.size} servers & ${userCount} users! | Want to support Translate's existence? go here! https://www.patreon.com/TannerReynolds`,
    `${cmd_prefix} patreon | ${cmd_prefix} invite`,
    `${cmd_prefix} patreon`
  ]
  function newGame() {
    var randomNumber = Math.floor(Math.random() * gmstr.length)
    Client.editStatus('online', {
      name: gmstr[randomNumber],
      type: 0
    })
  }
  Client.editStatus('online', {
    name: `${cmd_prefix} help | ${Client.guilds.size} servers & ${userCount} users! | Want to support Translate's existence? go here! https://www.patreon.com/TannerReynolds`,
    type: 0
  })
})

Client.on('guildCreate', (guild) => {
  guild_status.update(Client, guild, true);
  guild_size = Client.guilds.size
  shard_size = Client.shards.size
})

Client.on('guildDelete', (guild) => {
  guild_status.update(Client, guild, false);
  guild_size = Client.guilds.size
  shard_size = Client.shards.size
})

Client.on("messageCreate", async (msg) => {

  // if(msg.author.bot) return

  await conn.table('channels').get(msg.channel.id).run().then(async (Tres) => {
    if (!Tres) return
    if (msg.channel.id !== Tres.channelID || msg.content.toLowerCase().startsWith(':t')) return
    if (msg.content.startsWith('<') && msg.content.endsWith('>') || msg.content.startsWith('<')) return
    if (msg.content == "" || msg.content == null || msg.content == undefined) return
    return await translate(msg.content).then(async (res) => {
      cmdCounts.characters = cmdCounts.characters + msg.content.length
      cmdCounts.ran++
      let iso1 = Tres.firstLang.replace(/[()]+/, '')
      let iso2 = Tres.secondLang.replace(/[()]+/, '')
      await translate(msg.content, {
        to: ((res.from.language.iso === iso1) ? iso2 : iso1)
      }).then(async (reso) => {
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

  if(msg.content.toLowerCase().indexOf(cmd_prefix) !== 0) return;
  const args = msg.content.slice(cmd_prefix.length).trim().split(/ +/g);
  const command = args.shift().toString().toLowerCase();

  let CMD = commands.get(command)

  if (CMD) {
    return await CMD(Client, msg, args, cmdCounts, conn)
  }

  if(msg.content.toLowerCase().indexOf(cmd_prefix + " ") == 0){
    cmdCounts.characters = cmdCounts.characters + args.join(" ").length
    cmdCounts.ran++
    return await require('./commands/_translate.js').execute(Client, msg, args, command, cmdCounts)
  }

})

Client.connect()



// Bot lists update every hour //
setInterval(() => { return botLists.send(guild_size, shard_size) }, 1800000)

// ERROR HANDLING //
process.on('unhandledRejection', (reason)=>{ console.log("unhandledRejection\n" + reason); return; })
process.on('uncaughtException', (err)=>{ console.log("uncaughtException\n" + err); return; })
