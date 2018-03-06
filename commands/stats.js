const ostb = require('os-toolbox');
const { exec } = require('child_process');
module.exports = {
  command:"stats",
  execute:async (bot, msg, args, command, cmdCounts) => {
    await msg.channel.createMessage("<a:loading:393670580232257538> Performing speedtests...")
    .then((message)=>{
      let servers = bot.guilds.size,
          mintime = ostb.uptime() / 60,
          uptime = Math.floor(mintime / 60),
          serversLarge = bot.guilds.filter(m => m.large).size,
          botPing = Math.floor(msg.channel.guild.shard.latency);

      exec("speedtest-cli --simple", (error, stdout, stderr) => {
      ostb.cpuLoad().then((cpuusage)=>{ ostb.memoryUsage().then((memusage)=>{ ostb.currentProcesses().then((processes)=>{
        const curpro = processes;
        const meuse = memusage;
        const acusage = cpuusage;
        message.delete()
        msg.channel.createMessage({ embed: {
          color: 0x36393E,
          author: { name: `${msg.author.username}#${msg.author.discriminator}`, icon_url: msg.author.avatarURL },
          title: "Statistics",
          footer: { text: msg.channel.guild.name, icon_url: msg.channel.guild.iconURL },
          fields: [
            { name: 'Server Memory Usage', value: `${meuse}%` },
            { name: 'Nodejs Memory Usage', value: `${processMemoryMB().toString()} MB` },
            { name: 'Nodejs Version', value: process.version },
            { name: 'Shard Count', value: bot.shards.size },
            { name: 'Guild Count', value: bot.guilds.size },
            { name: 'Member Count', value: bot.users.size },
            { name: 'Times Translated (Since Restart)', value: cmdCounts.ran },
            { name: 'Amount Of Characters Translated (Since Restart)', value: cmdCounts.characters },
            { name: 'Client Uptime', value: `${Math.floor(((bot.uptime / (1000*60*60)) % 24))} hours` },
            { name: 'Server Uptime', value: `${JSON.stringify(uptime)} hours` },
            { name: 'Speed Test Results', value: `\`\`\`\n${stdout}\n\`\`\`` }
          ]
        }});
      });});});});
    });
  }
}
function processMemoryMB() {
  let heap = process.memoryUsage().heapUsed
  let MB = heap / 1048576;
  return Math.floor(MB)
}
