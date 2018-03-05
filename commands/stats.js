const ostb = require('os-toolbox');
module.exports = {
  command: "stats",
  execute: async (bot, msg, args) => {
    return await msg.channel.createMessage("Getting Statistics...")
    .then(async (message) => {
      let servers = bot.guilds.size,
          playercount = bot.users.size,
          mintime = ostb.uptime() / 60,
          uptime = Math.floor(mintime / 60),
          serversLarge = bot.guilds.filter(m => m.large).size,
          botPing = Math.floor(msg.channel.guild.shard.latency);
      return await ostb.cpuLoad().then(async (cpuusage)=>{ await ostb.memoryUsage().then(async (memusage)=>{ await ostb.currentProcesses().then(async (processes)=>{
        const curpro = processes
        const meuse = memusage
        const acusage = cpuusage
        return await message.edit(
          "**Statistics:**\n```INI\n[CPU]: "+acusage+"%\n\n"+
          "[RAM]: "+meuse+"%\n\n"+
          "[Shards]: "+bot.shards.size+"\n\n"+
          "[Network Speed]: 1gbps\n\n"+
          "[Ping]: "+botPing+"\n\n"+
          "[Guilds bot is running on]: "+servers+"\n\n"+
          "[Total Member Count]: "+playercount+"\n\n"+
          "[Platform]: CentOS 7 x64 - Linux\n\n"+
          "[Server Location]: San Jose\n\n"+
          "[Hosting Provider]: Vultr Holdings LLC\n\n"+
          "[Client Uptime]: "+Math.floor(((bot.uptime / (1000*60*60)) % 24))+" hours\n\n"+
          "[Server Uptime]: "+JSON.stringify(uptime)+" hours```"
        )
      })})})
    })
  }
}
