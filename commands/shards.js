module.exports = {
  command:"shards",
  execute:async function(bot, msg, args){
    await msg.channel.createMessage("Getting Shards...")
    .then((message)=>{
      let shardMap = bot.shards.map(s => `[ID]: ${s.id} | [Ping]: ${s.latency} | [Status]: ${s.status}`).join("\n");
      message.edit("**Shards:**\n```INI\n"+shardMap+"```");
    });
  }
}
