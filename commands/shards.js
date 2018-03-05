module.exports = {
  command: "shards",
  execute: async (bot, msg, args) => {
    return await msg.channel.createMessage("Getting Shards...")
    .then(async (message) => {
      let shards = ''
      bot.shards.map((s) => {
        if (msg.channel.guild.shard === s) shards += `= [ID]: ${((s.id.length === 1) ? s.id + ' ' : s.id)} | CURRENT SHARD | =\n`
        else shards += `= [ID]: ${((s.id.length === 1) ? s.id + ' ' : s.id)} | [Ping]: ${((s.latency.length === 2) ? s.latency + ' ' : s.latency)}ms | [Status]: ${s.status} =\n`
      }).join("\n");
      let s = msg.channel.guild.shard;
      return await message.edit(`\`\`\`asciidoc\n[Current Shard]\n= [ID]: ${((s.id.length === 1) ? s.id + ' ' : s.id)} | [Ping]: ${((s.latency.length === 2) ? s.latency + ' ' : s.latency)}ms | [Status]: ${s.status} =\n\n[Other Shards]\n${shards}\n\`\`\``);
    })
  }
}
