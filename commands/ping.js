module.exports = {
  command:"ping",
  execute:async function(bot, msg, args){
    let botPing = Math.floor(msg.channel.guild.shard.latency);
    await msg.channel.createMessage({embed: {
      color:0xFFFFFF, description: `:satellite_orbital: ${botPing}ms`
    }});
  }
}
