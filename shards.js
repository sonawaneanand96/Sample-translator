module.exports = {
  command:"shards",
  execute:async function(bot, msg, args){
    await msg.channel.createMessage("Getting Shards...")
    .then((message)=>{
      let shardMap = bot.shards.map(s => `= [ID]: ${s.id} | [Ping]: ${s.latency} | [Status]: ${s.status} =`).join("\n");
      let s = msg.channel.guild.shard;
      message.edit(`\`\`\`asciidoc\n[Current Shard]\n= [ID]: ${s.id} | [Ping]: ${s.latency} | [Status]: ${s.status} =\n[All Shards]\n${shardMap}\n\`\`\``);
    });
  }
}
